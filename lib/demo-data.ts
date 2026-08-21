import { differenceInCalendarDays, parseISO } from "date-fns";

export type Decision = "pending" | "renew" | "renegotiate" | "cancel";
export type Risk = "critical" | "attention" | "clear";

export type Contract = {
  id: string;
  vendor: string;
  agreement: string;
  annualExposure: number;
  renewalDate: string;
  noticeDays: number;
  cancelByDate: string;
  owner: string;
  autoRenew: boolean;
  decision: Decision;
  source: {
    page: number;
    section: string;
    clause: string;
  };
};

export const demoToday = "2026-08-21";

type ContractInput = Omit<Contract, "cancelByDate">;

export function calculateCancelByDate(renewalDate: string, noticeDays: number) {
  const value = new Date(`${renewalDate}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() - noticeDays);
  return value.toISOString().slice(0, 10);
}

function defineContract(input: ContractInput): Contract {
  return { ...input, cancelByDate: calculateCancelByDate(input.renewalDate, input.noticeDays) };
}

export const contracts: Contract[] = [
  defineContract({ id: "hubspot-2026", vendor: "HubSpot", agreement: "Marketing Platform Agreement", annualExposure: 24000, renewalDate: "2026-11-01", noticeDays: 60, owner: "Sarah Chen", autoRenew: true, decision: "pending", source: { page: 8, section: "12.2", clause: "The Subscription Term will automatically renew for successive one-year periods unless Customer provides written notice of non-renewal at least sixty (60) days before the end of the then-current Subscription Term." } }),
  defineContract({ id: "datadog-2026", vendor: "Datadog", agreement: "Cloud Monitoring Order Form", annualExposure: 8400, renewalDate: "2026-10-24", noticeDays: 45, owner: "Mike Rivera", autoRenew: true, decision: "renegotiate", source: { page: 4, section: "6.1", clause: "The Order will renew for an additional annual term unless either party gives written notice at least forty-five (45) days before the current term expires." } }),
  defineContract({ id: "salesforce-2026", vendor: "Salesforce", agreement: "Enterprise Services Order", annualExposure: 36000, renewalDate: "2026-10-17", noticeDays: 30, owner: "You", autoRenew: true, decision: "pending", source: { page: 11, section: "9.3", clause: "Subscriptions renew automatically for periods equal to the expiring subscription term unless notice of non-renewal is received no less than thirty (30) days before expiration." } }),
  defineContract({ id: "adobe-2026", vendor: "Adobe", agreement: "Creative Cloud Team Agreement", annualExposure: 4200, renewalDate: "2026-12-01", noticeDays: 30, owner: "James Cole", autoRenew: true, decision: "renew", source: { page: 6, section: "7", clause: "The plan renews for a further twelve-month term unless Customer elects not to renew at least thirty (30) days before the renewal date." } }),
];

export function getContract(id: string) {
  return contracts.find((contract) => contract.id === id);
}

export function getDaysRemaining(cancelByDate: string, referenceDate = demoToday) {
  return differenceInCalendarDays(parseISO(cancelByDate), parseISO(referenceDate));
}

export function getOperationalRisk(contract: Contract, referenceDate = demoToday): Risk {
  const days = getDaysRemaining(contract.cancelByDate, referenceDate);
  if (contract.decision === "pending" && days <= 14) return "critical";
  if ((contract.decision === "pending" || contract.decision === "renegotiate") && days <= 30) return "attention";
  return "clear";
}

export const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
export const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function formatDate(value: string) { return date.format(new Date(`${value}T00:00:00Z`)); }
export function formatShortDate(value: string) { return shortDate.format(new Date(`${value}T00:00:00Z`)); }

export const inboxMetrics = {
  attention: contracts.filter((contract) => getOperationalRisk(contract) !== "clear").length,
  exposure: contracts.filter((contract) => contract.decision === "pending" || contract.decision === "renegotiate").reduce((total, contract) => total + contract.annualExposure, 0),
  decisionsNeeded: contracts.filter((contract) => contract.decision === "pending").length,
  urgent: contracts.filter((contract) => getDaysRemaining(contract.cancelByDate) < 14 && contract.decision === "pending").length,
};
