export interface Stat {
  value: string;
  label: string;
  sublabel: string;
}

export interface Unlock {
  heading: string;
  text: string;
}

export interface Role {
  id: string;
  badge: string;
  title: string;
  identity: string;
  colorClass: string;
  stats: Stat[];
  unlock: Unlock;
}

export interface CompLevel {
  desc: string;
  quant: string;
}

export interface Competency {
  name: string;
  num: string;
  sa: CompLevel;
  sr: CompLevel;
  adv: CompLevel;
  pri: CompLevel;
}

export interface MetricLevel {
  pill: string | null;
  pillType?: string;
  note: string | null;
}

export interface Metric {
  label: string;
  sublabel: string;
  sa: MetricLevel;
  sr: MetricLevel;
  adv: MetricLevel;
  pri: MetricLevel;
}

export interface EvidenceGroup {
  group: string;
  metrics: Metric[];
}

export interface Gate {
  label: string;
  question: string;
}

export interface SiteData {
  title: string;
  subtitle: string;
  tag: string;
  promotionGates: Gate[];
  timingRule: string;
  missedInsight: string;
}
