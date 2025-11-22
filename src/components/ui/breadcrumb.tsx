import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
    current?: boolean
  }>
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      <Link href="/dashboard" className="flex items-center hover:text-foreground">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href && !item.current ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-foreground font-medium" : ""}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export { Breadcrumb }