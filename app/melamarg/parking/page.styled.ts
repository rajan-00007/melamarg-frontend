import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.5; }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #fdfcf7; /* Premium cream background from mock */
  min-height: 100%;
  flex: 1;
  padding: 24px 20px 100px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

export const BackRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  color: #1e293b;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin: 4px 0 20px 0;
  font-weight: 500;
`;

export const SearchBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  border: 1.5px solid #f1f5f9;
  margin-bottom: 24px;
  gap: 12px;

  svg.search-icon {
    color: #94a3b8;
  }

  svg.filter-icon {
    color: #475569;
    margin-left: auto;
    cursor: pointer;
  }
`;

export const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 15px;
  color: #0f172a;
  width: 100%;
  font-weight: 500;

  &::placeholder {
    color: #94a3b8;
  }
`;

export const FeaturedCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.05);
  border: 1.5px solid #f1f5f9;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const FastFillBadge = styled.div`
  align-self: flex-start;
  background: #047857; /* Deep emerald */
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 12px;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.01em;
`;

export const CardDistance = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  margin-top: 4px;

  svg {
    color: #94a3b8;
  }
`;

export const CardSpotsCount = styled.div`
  text-align: right;
  
  .count {
    font-size: 32px;
    font-weight: 800;
    color: #b45309; /* Warm amber/brown */
    line-height: 1;
  }
  
  .label {
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 2px;
  }
`;

export const ProgressBarWrapper = styled.div`
  margin: 20px 0;
`;

export const ProgressBar = styled.div<{ $percent: number }>`
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.$percent}%;
    background: #b45309; /* Deep rust/orange */
    border-radius: 99px;
  }
`;

export const ReserveButton = styled.button<{ $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#cbd5e1' : '#b45309'}; /* Rust brown */
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  box-shadow: ${props => props.$disabled ? 'none' : '0 4px 12px rgba(180, 83, 9, 0.2)'};

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'scale(0.98)'};
  }
`;

export const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;

export const MiniCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  border: 1.5px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  cursor: pointer;
`;

export const MiniCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const MiniTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const MiniStatus = styled.span<{ $type: 'full' | 'free' }>`
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$type === 'full' ? '#ef4444' : '#059669'};
`;

export const MiniMeta = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #64748b;
  font-weight: 600;

  .price {
    font-size: 14px;
    color: #0f172a;
    font-weight: 700;
  }
`;

export const ListCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
  border: 1.5px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  margin-bottom: 14px;
`;

export const ListCardActions = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const CompactReserveButton = styled.button<{ $disabled?: boolean }>`
  flex: 1;
  background: ${props => props.$disabled ? '#cbd5e1' : '#b45309'};
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  box-shadow: ${props => props.$disabled ? 'none' : '0 2px 6px rgba(180, 83, 9, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:active {
    transform: ${props => props.$disabled ? 'none' : 'scale(0.98)'};
  }
`;

export const CompactRouteButton = styled.button`
  flex: 1;
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:active {
    transform: scale(0.98);
  }
`;

export const ListIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
`;

export const ListInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
`;

export const ListTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const ListMeta = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

export const LiveSyncBadge = styled.div<{ $active: boolean }>`
  align-self: center;
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$active ? '#e6f4ea' : '#f1f5f9'};
  color: ${props => props.$active ? '#137333' : '#475569'};
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 99px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  margin-bottom: 24px;
  cursor: pointer;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$active ? '#137333' : '#64748b'};
    animation: ${props => props.$active ? pulse : 'none'} 2s infinite ease-in-out;
  }
`;

export const TicketCard = styled.div`
  background: #e6f7f4; /* Cyan/mint background from mock */
  border-radius: 24px;
  border: 2px dashed #a7f3d0;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(5, 150, 105, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
`;

export const TicketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TicketIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #34d399;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
`;

export const TicketTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #064e3b;
  margin: 0;
`;

export const TicketSubtitle = styled.p`
  font-size: 13px;
  color: #047857;
  font-weight: 600;
  margin: 2px 0 0 0;
`;

export const TicketBody = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #d1fae5;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TicketRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #064e3b;
  font-weight: 700;

  .value {
    font-family: monospace;
    font-size: 15px;
    color: #0f172a;
    background: #f1f5f9;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .countdown {
    color: #b45309;
    font-size: 16px;
    font-weight: 800;
  }
`;

export const TicketCancelButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  align-self: center;
  text-decoration: underline;

  &:hover {
    color: #dc2626;
  }
`;

export const PriceBadge = styled.div<{ $isPaid: boolean }>`
  align-self: flex-start;
  background: ${props => props.$isPaid ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  color: ${props => props.$isPaid ? '#ef4444' : '#10b981'};
  border: 1px solid ${props => props.$isPaid ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'};
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Slots Selector Modal Styles
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px 16px 90px 16px;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: #ffffff;
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(241, 245, 249, 0.8);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUp {
    from { transform: translateY(100px); }
    to { transform: translateY(0); }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
  font-weight: 500;
`;

export const CloseButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  
  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

export const CounterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px 0;
`;

export const CounterButton = styled.button`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: #0f172a;
    background: #f1f5f9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CounterValue = styled.span`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  min-width: 40px;
  text-align: center;
`;

export const ModalInfoCard = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 14px 16px;
  border: 1.5px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
`;

export const ConfirmButton = styled.button`
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);

  &:hover {
    background: #1e293b;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
