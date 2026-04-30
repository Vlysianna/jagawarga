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
    <div className="-mx-4 -mt-4 mb-6 border-b border-neutral-border bg-white px-4 py-4 sm:-mx-6 sm:-mt-6 sm:px-6 sm:py-5 md:-mx-8 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
        {actions && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:shrink-0 sm:justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
