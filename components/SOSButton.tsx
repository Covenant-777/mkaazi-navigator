"use client";

import { Button, Modal, Stack, Group, Text, Card, ThemeIcon, Alert } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { 
  IconAlertTriangle, 
  IconPhone, 
  IconShield, 
  IconScale, 
  IconHeartHandshake,
  IconSos
} from "@tabler/icons-react";

interface SOSButtonProps {
  language: string;
  t: any;
}

export function SOSButton({ language, t }: SOSButtonProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const emergencyContacts = [
    { name: "Police Emergency", number: "999", icon: IconShield, color: "red" },
    { name: "Police (Alternative)", number: "112", icon: IconShield, color: "red" },
    { name: "Kituo cha Sheria (Legal Aid)", number: "0722522233", icon: IconScale, color: "blue" },
    { name: "FIDA Kenya (Women's Rights)", number: "0722201061", icon: IconHeartHandshake, color: "green" },
    { name: "KNCHR (Human Rights)", number: "0202733000", icon: IconAlertTriangle, color: "yellow" },
  ];

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .sos-button {
          animation: pulse 2s infinite;
          position: fixed;
          bottom: 80px;
          right: 16px;
          z-index: 100;
          border-radius: 50px;
          padding: 12px 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        @media (max-width: 768px) {
          .sos-button {
            bottom: 70px;
            right: 12px;
            padding: 10px 16px;
          }
        }
      `}</style>

      <Button
        className="sos-button"
        variant="filled"
        color="red"
        size="lg"
        leftSection={<IconSos size={24} />}
        onClick={open}
      >
        🚨 {t.emergencyHelp}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={<Text fw={700} size="xl">🚨 {t.emergencyContacts}</Text>}
        size="md"
        radius="lg"
      >
        <Stack gap="md">
          <Alert color="red" title={t.emergencyAlert}>
            {t.emergencyMessage}
          </Alert>
          
          {emergencyContacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <Card 
                key={index} 
                withBorder 
                p="sm" 
                radius="md"
                onClick={() => makeCall(contact.number)} 
                style={{ cursor: 'pointer' }}
              >
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <ThemeIcon color={contact.color} size="lg" radius="xl">
                      <Icon size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="sm">{contact.name}</Text>
                      <Text size="xs" c="dimmed">{contact.number}</Text>
                    </div>
                  </Group>
                  <Button size="xs" color="green" leftSection={<IconPhone size={14} />} onClick={(e) => {
                    e.stopPropagation();
                    makeCall(contact.number);
                  }}>
                    {t.call}
                  </Button>
                </Group>
              </Card>
            );
          })}
          
          <Text size="xs" c="dimmed" ta="center" mt="md">
            {t.sosNote}
          </Text>
        </Stack>
      </Modal>
    </>
  );
}