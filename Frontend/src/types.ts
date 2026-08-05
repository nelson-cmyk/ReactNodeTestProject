export interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  guideline?: boolean;
  buttonText?: string;
  action?: string;
  onAction: () => void;
}