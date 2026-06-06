"use client";

import { useState, useEffect } from "react";
import { Button, Paper, Group, Text } from "@mantine/core";
import { IconDeviceMobile } from "@tabler/icons-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <Paper 
      style={{ 
        position: 'fixed', 
        bottom: 20, 
        left: 20, 
        right: 20, 
        zIndex: 200,
        background: 'white',
        padding: 16,
        borderRadius: 16,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <Group justify="space-between">
        <Group gap="sm">
          <IconDeviceMobile size={24} color="#4f46e5" />
          <div>
            <Text fw={700} size="sm">Install Mkaazi Navigator</Text>
            <Text size="xs" c="dimmed">Add to home screen for easy access</Text>
          </div>
        </Group>
        <Button size="sm" onClick={handleInstall}>Install</Button>
      </Group>
    </Paper>
  );
}