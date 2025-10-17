import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if none provided
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Tank', href: '/tank' }
  ];

  const breadcrumbItems = items || defaultItems;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
            )}
            <Link
              to={item.href}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md transition-smooth hover:bg-accent hover:text-accent-foreground",
                location.pathname === item.href 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}