"use client";

import { useState, useEffect } from "react";
import { Badge, Tooltip } from "@mantine/core";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Tooltip label={isOnline ? "You're online" : "Working offline - your data saves locally"}>
      <Badge 
        color={isOnline ? "green" : "yellow"} 
        variant="light"
        leftSection={isOnline ? <IconWifi size={14} /> : <IconWifiOff size={14} />}
      >
        {isOnline ? "Online" : "Offline"}
      </Badge>
    </Tooltip>
  );
}