import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image } from "lucide-react";

interface TableProps<T> {
    columns: Array<{
        key: keyof T;
        label: string;
        render?: (value: T[keyof T], row: T) => React.ReactNode;
    }>;
    data: T[];
    actions?: (row: T) => React.ReactNode;
    className?: string;
}

export function TopRated<T>({ columns, data, actions, className }: TableProps<T>) {
    return (
        <div className={`rounded-md border bg-white text-left ${className}`}>
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={String(column.key)}>{column.label}</TableHead>
                        ))}
                        {actions && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column) => (
                                <TableCell
                                    key={String(column.key)}
                                    className="max-w-[150px] truncate overflow-hidden whitespace-nowrap"
                                >
                                    {column.key === 'image' ? (
                                        row[column.key] ? (
                                            <img
                                                src={row[column.key] as string}
                                                alt="item"
                                                className="w-12 h-12 object-cover rounded-md"
                                            />
                                        ) : (
                                            <Image className="text-gray-400 w-12 h-12" />
                                        )
                                    ) : column.render ? (
                                        column.render(row[column.key], row)
                                    ) : (
                                        String(row[column.key])
                                    )}
                                </TableCell>
                            ))}
                            {actions && (
                                <TableCell className="max-w-[150px] truncate overflow-hidden whitespace-nowrap">
                                    {actions(row)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
