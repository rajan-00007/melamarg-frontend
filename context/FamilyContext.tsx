'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import axiosClient from '@/lib/axios/axiosClient';
import { useUserTest } from '@/context/UserTestContext';

export interface MeetupGroup {
  id: string;
  event_id: string;
  name: string;
  code: string;
  pin: string;
  assembly_point_id?: string | null;
  assembly_custom_lat?: number | null;
  assembly_custom_lng?: number | null;
  assembly_custom_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetupMember {
  id: string;
  group_id: string;
  name: string;
  is_organizer: boolean;
  latitude?: number | null;
  longitude?: number | null;
  last_active_at: string;
  created_at: string;
  updated_at: string;
  status?: 'online' | 'offline';
}

interface FamilyContextType {
  currentGroup: MeetupGroup | null;
  myMemberInfo: { id: string; name: string; isOrganizer: boolean } | null;
  membersList: MeetupMember[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  createGroup: (name: string, pin: string, memberName: string) => Promise<void>;
  joinGroup: (code: string, pin: string, memberName: string) => Promise<void>;
  updateAssemblyPoint: (poiId?: string | null, customLat?: number | null, customLng?: number | null, customName?: string | null) => Promise<void>;
  leaveGroup: () => Promise<void>;
  sendPulseRequest: (targetMemberId: string) => void;
  clearError: () => void;
  refreshGroupDetails: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const { backendUrl, userGps, selectedEvent } = useUserTest();

  const [currentGroup, setCurrentGroup] = useState<MeetupGroup | null>(null);
  const [myMemberInfo, setMyMemberInfo] = useState<{ id: string; name: string; isOrganizer: boolean } | null>(null);
  const [membersList, setMembersList] = useState<MeetupMember[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const isInitialized = useRef(false);

  const clearError = () => setError(null);

  // Helper to extract raw Socket.io host URL from /api/ REST base URL
  const getSocketUrl = useCallback(() => {
    if (!backendUrl) return '';
    return backendUrl.replace(/\/api\/?$/, '');
  }, [backendUrl]);

  // Fetch latest group details and members list from server
  const refreshGroupDetails = useCallback(async () => {
    if (!currentGroup || !myMemberInfo) return;
    try {
      const res = await axiosClient.get(`meetup/groups/${currentGroup.id}?memberId=${myMemberInfo.id}`);
      if (res.data && res.data.success) {
        setCurrentGroup(res.data.data.group);
        setMembersList(res.data.data.members);
      }
    } catch (err: any) {
      console.error('[FamilyContext] Error refreshing group details:', err);
      // If group is not found (404) or user is kicked (403), dissolve locally
      if (err.response?.status === 404 || err.response?.status === 403) {
        localStorage.removeItem('mm_meetup_group');
        localStorage.removeItem('mm_meetup_member');
        setCurrentGroup(null);
        setMyMemberInfo(null);
        setMembersList([]);
      }
    }
  }, [currentGroup?.id, myMemberInfo?.id]);

  // Disconnect Socket
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log('[FamilySocket] Disconnecting socket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Connect Socket and join room
  const connectSocket = useCallback((groupId: string, memberId: string) => {
    const socketUrl = getSocketUrl();
    if (!socketUrl) return;

    if (socketRef.current) {
      disconnectSocket();
    }

    console.log(`[FamilySocket] Connecting to namespace '/meetup' at ${socketUrl}`);
    
    // Connect strictly to the '/meetup' namespace as defined in backend
    const socket = io(`${socketUrl}/meetup`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[FamilySocket] Connected successfully, joining group room:', groupId);
      setIsConnected(true);
      socket.emit('join_group_room', { groupId, memberId });
    });

    socket.on('disconnect', () => {
      console.log('[FamilySocket] Socket disconnected.');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[FamilySocket] Connection error:', err);
      setIsConnected(false);
    });

    // Listen for real-time location broadcasts from other family members
    socket.on('location_updated', (data: {
      memberId: string;
      latitude: number;
      longitude: number;
      lastActiveAt: string;
    }) => {
      setMembersList((prev) =>
        prev.map((m) =>
          m.id === data.memberId
            ? {
                ...m,
                latitude: data.latitude,
                longitude: data.longitude,
                last_active_at: data.lastActiveAt,
                status: 'online'
              }
            : m
        )
      );
    });

    // Listen for status changes (online/offline status based on connection)
    socket.on('member_status_changed', (data: { memberId: string; status: 'online' | 'offline' }) => {
      setMembersList((prev) =>
        prev.map((m) =>
          m.id === data.memberId
            ? { ...m, status: data.status }
            : m
        )
      );
    });

    // Listen for assembly point updates to trigger a reload of group details
    socket.on('assembly_updated', () => {
      console.log('[FamilySocket] Assembly point was changed by another member, refreshing details...');
      refreshGroupDetails();
    });

    // Listen for pulse alerts directed at us
    socket.on('pulse_received', (data: { targetMemberId: string; senderName: string }) => {
      if (data.targetMemberId === memberId) {
        console.log(`[FamilySocket] Pulse alert received from ${data.senderName}. Triggering immediate location update.`);
        
        // Trigger device vibration as haptic feedback
        if (typeof window !== 'undefined' && navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        // Trigger immediate location publish if GPS is available
        if (userGps && userGps[0] !== 0) {
          socket.emit('publish_location', {
            groupId,
            memberId,
            latitude: userGps[0],
            longitude: userGps[1]
          });
        }
      }
    });

  }, [getSocketUrl, userGps, disconnectSocket, refreshGroupDetails]);

  // Load group session from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized.current) {
      isInitialized.current = true;
      const savedGroup = localStorage.getItem('mm_meetup_group');
      const savedMember = localStorage.getItem('mm_meetup_member');
      
      if (savedGroup && savedMember) {
        try {
          const parsedGroup = JSON.parse(savedGroup);
          const parsedMember = JSON.parse(savedMember);
          setCurrentGroup(parsedGroup);
          setMyMemberInfo(parsedMember);
          
          // Connect socket immediately
          connectSocket(parsedGroup.id, parsedMember.id);
        } catch (e) {
          console.error('[FamilyContext] Failed to parse saved session:', e);
        }
      }
    }
  }, [connectSocket]);

  // Fetch initial member list once group state is loaded
  useEffect(() => {
    if (currentGroup && myMemberInfo && membersList.length === 0) {
      refreshGroupDetails();
    }
  }, [currentGroup, myMemberInfo, membersList.length, refreshGroupDetails]);

  // Publish our coordinates dynamically over the socket whenever our GPS changes (Zero Polling)
  useEffect(() => {
    if (
      currentGroup &&
      myMemberInfo &&
      socketRef.current &&
      isConnected &&
      userGps &&
      userGps[0] !== 0 &&
      userGps[1] !== 0
    ) {
      console.log('[FamilySocket] Emitting location update:', userGps);
      socketRef.current.emit('publish_location', {
        groupId: currentGroup.id,
        memberId: myMemberInfo.id,
        latitude: userGps[0],
        longitude: userGps[1]
      });
    }
  }, [userGps, currentGroup, myMemberInfo, isConnected]);

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  // Create Family Group
  const createGroup = async (name: string, pin: string, memberName: string) => {
    if (!selectedEvent) {
      setError('No festival or event selected.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Client-side generated member UUID to prevent session clashes
      const localMemberId = crypto.randomUUID();

      const res = await axiosClient.post('meetup/groups', {
        eventId: selectedEvent.id,
        name,
        pin,
        memberName,
        memberId: localMemberId
      });

      if (res.data && res.data.success) {
        const { group, member } = res.data.data;
        setCurrentGroup(group);
        
        const memberInfo = {
          id: member.id,
          name: member.name,
          isOrganizer: member.is_organizer
        };
        setMyMemberInfo(memberInfo);
        setMembersList([member]);

        // Persist to localStorage
        localStorage.setItem('mm_meetup_group', JSON.stringify(group));
        localStorage.setItem('mm_meetup_member', JSON.stringify(memberInfo));

        // Connect real-time socket
        connectSocket(group.id, member.id);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create group. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Join Family Group
  const joinGroup = async (code: string, pin: string, memberName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Client-side generated member UUID
      const localMemberId = crypto.randomUUID();

      const res = await axiosClient.post('meetup/groups/join', {
        code,
        pin,
        memberName,
        memberId: localMemberId
      });

      if (res.data && res.data.success) {
        const { group, member } = res.data.data;
        setCurrentGroup(group);

        const memberInfo = {
          id: member.id,
          name: member.name,
          isOrganizer: member.is_organizer
        };
        setMyMemberInfo(memberInfo);

        // Persist
        localStorage.setItem('mm_meetup_group', JSON.stringify(group));
        localStorage.setItem('mm_meetup_member', JSON.stringify(memberInfo));

        // Connect real-time socket
        connectSocket(group.id, member.id);
        
        // Refresh details to fetch sibling members
        setTimeout(() => refreshGroupDetails(), 300);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to join group. Check the code and PIN.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Assembly Point (POI ID or custom coordinates)
  const updateAssemblyPoint = async (
    poiId?: string | null,
    customLat?: number | null,
    customLng?: number | null,
    customName?: string | null
  ) => {
    if (!currentGroup || !myMemberInfo) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await axiosClient.put(`meetup/groups/${currentGroup.id}/assembly`, {
        memberId: myMemberInfo.id,
        assemblyPointId: poiId,
        customLat,
        customLng,
        customName
      });

      if (res.data && res.data.success) {
        const updatedGroup = res.data.data;
        setCurrentGroup(updatedGroup);
        localStorage.setItem('mm_meetup_group', JSON.stringify(updatedGroup));

        // Notify other members via socket so their maps update instantly
        if (socketRef.current && isConnected) {
          socketRef.current.emit('assembly_changed', { groupId: currentGroup.id });
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to update assembly point.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Leave Family Group
  const leaveGroup = async () => {
    if (!currentGroup || !myMemberInfo) return;
    setIsLoading(true);
    setError(null);

    try {
      await axiosClient.delete(`meetup/groups/${currentGroup.id}/members/${myMemberInfo.id}`);
      
      // Clean up socket
      disconnectSocket();

      // Clear local states
      setCurrentGroup(null);
      setMyMemberInfo(null);
      setMembersList([]);

      // Clear persistence
      localStorage.removeItem('mm_meetup_group');
      localStorage.removeItem('mm_meetup_member');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to leave group.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger real-time pulse alert to request immediate coordinates from another member
  const sendPulseRequest = (targetMemberId: string) => {
    if (!currentGroup || !myMemberInfo || !socketRef.current || !isConnected) return;
    socketRef.current.emit('pulse_request', {
      groupId: currentGroup.id,
      targetMemberId,
      senderName: myMemberInfo.name
    });
  };

  return (
    <FamilyContext.Provider
      value={{
        currentGroup,
        myMemberInfo,
        membersList,
        isConnected,
        isLoading,
        error,
        createGroup,
        joinGroup,
        updateAssemblyPoint,
        leaveGroup,
        sendPulseRequest,
        clearError,
        refreshGroupDetails
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
}
