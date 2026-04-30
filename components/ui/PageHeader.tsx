import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  backHref,
  icon: Icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-border px-6 py-5 -m-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="mt-0.5 p-1.5 rounded-lg text-neutral-text hover:bg-neutral-bg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
          )}
          {Icon && !backHref && (
            <div className="mt-0.5 p-1.5 rounded-lg bg-blue-light text-blue-primary">
              <Icon size={20} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-sm text-neutral-text mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
