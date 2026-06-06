"use client";

import { useState, useEffect } from "react";
import { Card, Stack, Group, Text, Button, Modal, Input, Textarea, Badge, ScrollArea, Paper, Title, Divider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus, IconTrash, IconBell, IconCalendar, IconFileText } from "@tabler/icons-react";

interface LegalCase {
  id: string;
  title: string;
  description: string;
  status: "active" | "pending" | "resolved";
  dateCreated: string;
  nextHearing?: string;
  notes: string[];
}

interface CaseTrackerProps {
  language: string;
  t: any;
}

export function CaseTracker({ language, t }: CaseTrackerProps) {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [newCase, setNewCase] = useState({ title: "", description: "" });
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [caseModalOpened, { open: openCaseModal, close: closeCaseModal }] = useDisclosure(false);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("mkaazi-cases");
    if (saved) {
      setCases(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mkaazi-cases", JSON.stringify(cases));
  }, [cases]);

  const addCase = () => {
    if (!newCase.title) return;
    const newLegalCase: LegalCase = {
      id: Date.now().toString(),
      title: newCase.title,
      description: newCase.description,
      status: "active",
      dateCreated: new Date().toISOString(),
      notes: []
    };
    setCases([newLegalCase, ...cases]);
    setNewCase({ title: "", description: "" });
    closeCaseModal();
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  const updateCaseStatus = (id: string, status: LegalCase["status"]) => {
    setCases(cases.map(c => c.id === id ? { ...c, status } : c));
  };

  const addNote = (caseId: string) => {
    if (!newNote) return;
    setCases(cases.map(c => c.id === caseId ? { ...c, notes: [...c.notes, `${new Date().toLocaleDateString()}: ${newNote}`] } : c));
    setNewNote("");
    setSelectedCase(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "active": return "red";
      case "pending": return "yellow";
      case "resolved": return "green";
      default: return "gray";
    }
  };

  return (
    <Paper p="md" radius="lg" withBorder>
      <Group justify="space-between" mb="md">
        <Title order={3}>📋 {t.caseTracker || "Case Tracker"}</Title>
        <Button size="sm" leftSection={<IconPlus size={16} />} onClick={openCaseModal}>
          {t.newCase || "New Case"}
        </Button>
      </Group>

      {cases.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">{t.noCases || "No active cases. Start by adding one."}</Text>
      ) : (
        <ScrollArea h={400}>
          <Stack gap="md">
            {cases.map((legalCase) => (
              <Card key={legalCase.id} withBorder p="sm">
                <Group justify="space-between" align="start">
                  <div style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Badge color={getStatusColor(legalCase.status)}>
                        {legalCase.status === "active" && "Active"}
                        {legalCase.status === "pending" && "Pending"}
                        {legalCase.status === "resolved" && "Resolved"}
                      </Badge>
                      <Text size="xs" c="dimmed">{new Date(legalCase.dateCreated).toLocaleDateString()}</Text>
                    </Group>
                    <Text fw={700} size="md">{legalCase.title}</Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>{legalCase.description}</Text>
                    {legalCase.notes.length > 0 && <Badge size="sm" variant="light" mt="xs">{legalCase.notes.length} notes</Badge>}
                  </div>
                  <Group gap="xs">
                    <Button size="xs" variant="subtle" onClick={() => { setSelectedCase(legalCase); setNewNote(""); }}>
                      <IconFileText size={16} />
                    </Button>
                    <Button size="xs" variant="subtle" color="red" onClick={() => deleteCase(legalCase.id)}>
                      <IconTrash size={16} />
                    </Button>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      )}

      {/* New Case Modal */}
      <Modal opened={caseModalOpened} onClose={closeCaseModal} title={<Text fw={700}>📝 {t.newCase || "New Case"}</Text>}>
        <Stack>
          <Input placeholder={t.caseTitle || "Case title"} value={newCase.title} onChange={(e) => setNewCase({ ...newCase, title: e.target.value })} />
          <Textarea placeholder={t.caseDescription || "Case description"} value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} rows={4} />
          <Button onClick={addCase}>{t.save || "Save Case"}</Button>
        </Stack>
      </Modal>

      {/* Case Details Modal */}
      <Modal opened={!!selectedCase} onClose={() => setSelectedCase(null)} title={<Text fw={700}>📋 {selectedCase?.title}</Text>} size="lg">
        {selectedCase && (
          <Stack>
            <Text size="sm" c="dimmed">Created: {new Date(selectedCase.dateCreated).toLocaleDateString()}</Text>
            <Text>{selectedCase.description}</Text>
            <Divider />
            <Group justify="space-between">
              <Text fw={600}>{t.notes || "Notes"}</Text>
              <Group gap="xs">
                <select value={selectedCase.status} onChange={(e) => updateCaseStatus(selectedCase.id, e.target.value as any)} style={{ padding: "4px 8px", borderRadius: "4px" }}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </Group>
            </Group>
            <ScrollArea h={200}>
              {selectedCase.notes.length === 0 ? <Text c="dimmed" size="sm">{t.noNotes || "No notes yet"}</Text> : selectedCase.notes.map((note, i) => <Text key={i} size="sm">• {note}</Text>)}
            </ScrollArea>
            <Textarea placeholder={t.addNote || "Add a note..."} value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <Button onClick={() => addNote(selectedCase.id)}>{t.add || "Add Note"}</Button>
          </Stack>
        )}
      </Modal>
    </Paper>
  );
}