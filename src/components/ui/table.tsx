// @/components/ui/table.tsx
import { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-200">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-6 py-3 font-bold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
