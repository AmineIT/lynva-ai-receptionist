import { BotMessageSquare } from 'lucide-react';
import { Badge } from './badge';
import { useLayout } from './layout-context';

export function SiteHeader() {
  const { title, subtitle } = useLayout();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex flex-col">
          <h1 className="text-lg font-medium">{title}</h1>
          <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary">
            <BotMessageSquare className="!size-4" />
            AI Active
          </Badge>
        </div>
      </div>
    </header>
  )
}
