import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={cn("min-w-full divide-y divide-gray-200", className)} {...props}>
    {children}
  </table>
);

export const TableHeader = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-white", className)} {...props}>{children}</thead>
);

export const TableBody = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("bg-white divide-y divide-gray-200", className)} {...props}>{children}</tbody>
);

export const TableRow = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("", className)} {...props}>{children}</tr>
);

export const TableHead = ({ children, className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn("px-4 py-3 text-left text-sm font-medium text-gray-600", className)} {...props}>
    {children}
  </th>
);

export const TableCell = ({ children, className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3 text-sm text-gray-700", className)} {...props}>{children}</td>
);

// Legacy exports for backward compatibility
export const THead = TableHeader;
export const TBody = TableBody;
export const TR = TableRow;
export const TH = TableHead;
export const TD = TableCell;

export default Table;
