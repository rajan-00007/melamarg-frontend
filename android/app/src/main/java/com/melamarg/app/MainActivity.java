package com.melamarg.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        try {
            Class<?> firebaseAppClass = Class.forName("com.google.firebase.FirebaseApp");
            java.lang.reflect.Method getAppsMethod = firebaseAppClass.getMethod("getApps", android.content.Context.class);
            java.util.List<?> apps = (java.util.List<?>) getAppsMethod.invoke(null, this);
            if (apps == null || apps.isEmpty()) {
                // Initialize Firebase programmatically with dummy options to prevent crashes when google-services.json is missing
                Class<?> firebaseOptionsClass = Class.forName("com.google.firebase.FirebaseOptions");
                Class<?> builderClass = Class.forName("com.google.firebase.FirebaseOptions$Builder");
                Object builder = builderClass.getDeclaredConstructor().newInstance();
                
                builderClass.getMethod("setApplicationId", String.class).invoke(builder, "1:1234567890:android:1234567890");
                builderClass.getMethod("setApiKey", String.class).invoke(builder, "dummy-api-key-for-local-testing");
                builderClass.getMethod("setProjectId", String.class).invoke(builder, "dummy-project-id");
                builderClass.getMethod("setGcmSenderId", String.class).invoke(builder, "1234567890");
                
                Object options = builderClass.getMethod("build").invoke(builder);
                
                java.lang.reflect.Method initializeAppMethod = firebaseAppClass.getMethod("initializeApp", android.content.Context.class, firebaseOptionsClass);
                initializeAppMethod.invoke(null, this, options);
                android.util.Log.i("MainActivity", "Firebase initialized with dummy options using reflection.");
            }
        } catch (ClassNotFoundException e) {
            android.util.Log.i("MainActivity", "FirebaseApp class not found. Skipping dummy initialization.");
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "Failed to check or initialize dummy Firebase: ", e);
        }
    }
}
