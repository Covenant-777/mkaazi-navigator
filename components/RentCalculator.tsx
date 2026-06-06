"use client";

import { useState } from "react";
import { Card, Stack, Group, Text, NumberInput, Button, Alert, Divider, Title, Paper } from "@mantine/core";
import { IconCalculator, IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface RentCalculatorProps {
  language: string;
  t: any;
}

export function RentCalculator({ language, t }: RentCalculatorProps) {
  const [monthlyRent, setMonthlyRent] = useState<number | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(null);
  const [result, setResult] = useState<{ percentage: number; isAffordable: boolean; recommendation: string } | null>(null);

  const calculateAffordability = () => {
    if (!monthlyRent || !monthlyIncome || monthlyIncome <= 0) {
      return;
    }

    const percentage = (monthlyRent / monthlyIncome) * 100;
    const isAffordable = percentage <= 30;
    let recommendation = "";

    if (percentage <= 30) {
      recommendation = t.affordable;
    } else if (percentage <= 50) {
      recommendation = t.stretch;
    } else {
      recommendation = t.tooHigh;
    }

    setResult({ percentage, isAffordable, recommendation });
  };

  const reset = () => {
    setMonthlyRent(null);
    setMonthlyIncome(null);
    setResult(null);
  };

  const formatMoney = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <Paper p="md" radius="lg" withBorder>
      <Title order={3} mb="md">💰 {t.rentCalculator}</Title>
      
      {!result ? (
        <>
          <NumberInput
            label={t.monthlyRent}
            placeholder="e.g., 25000"
            value={monthlyRent}
            onChange={setMonthlyRent}
            thousandSeparator=","
            min={0}
            mb="md"
            size="lg"
            styles={{ input: { minHeight: "52px", fontSize: "16px" } }}
          />
          
          <NumberInput
            label={t.monthlyIncome}
            placeholder="e.g., 100000"
            value={monthlyIncome}
            onChange={setMonthlyIncome}
            thousandSeparator=","
            min={0}
            mb="lg"
            size="lg"
            styles={{ input: { minHeight: "52px", fontSize: "16px" } }}
          />
          
          <Button 
            fullWidth 
            onClick={calculateAffordability} 
            leftSection={<IconCalculator size={20} />} 
            size="lg"
            style={{ minHeight: "52px" }}
          >
            {t.calculateAffordability}
          </Button>
        </>
      ) : (
        <>
          <Alert
            color={result.isAffordable ? "green" : "red"}
            title={result.isAffordable ? t.goodNews : t.attention}
            icon={result.isAffordable ? <IconCheck /> : <IconAlertCircle />}
          >
            <Stack gap="xs">
              <Group justify="space-between" wrap="wrap">
                <Text fw={500}>{t.monthlyRent}:</Text>
                <Text>{formatMoney(monthlyRent!)}</Text>
              </Group>
              <Group justify="space-between" wrap="wrap">
                <Text fw={500}>{t.monthlyIncome}:</Text>
                <Text>{formatMoney(monthlyIncome!)}</Text>
              </Group>
              <Divider />
              <Group justify="space-between" wrap="wrap">
                <Text fw={500}>{t.rentPercentage}:</Text>
                <Text fw={700} size="lg">{result.percentage.toFixed(1)}%</Text>
              </Group>
              <Group justify="space-between" wrap="wrap">
                <Text fw={500}>{t.recommendation}:</Text>
                <Text>{result.recommendation}</Text>
              </Group>
              <Text size="sm" c="dimmed" mt="xs">{t.affordabilityNote}</Text>
            </Stack>
          </Alert>
          
          <Button 
            fullWidth 
            mt="md" 
            variant="light" 
            onClick={reset}
            size="lg"
            style={{ minHeight: "52px" }}
          >
            {t.calculateAgain}
          </Button>
        </>
      )}
    </Paper>
  );
}