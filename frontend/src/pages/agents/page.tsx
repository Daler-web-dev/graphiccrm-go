import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import React from 'react';

export const Agents: React.FC = () => {

    const agents = [
        {
            id: 1,
            name: "Azizbek Olimjonov",
            contact: "+998 90 123 45 67",
            login: "azizbekolimjonov",
            password: "azi*******",
        },
        {
            id: 2,
            name: "Jasurbek Tursunov",
            contact: "+998 95 123 45 67",
            login: "jasurbektursunov",
            password: "jas*******",
        },
        {
            id: 3,
            name: "Sarvarbek Mirzayev",
            contact: "+998 99 123 45 67",
            login: "sarvarbekmirzayev",
            password: "sar*******",
        },
        {
            id: 4,
            name: "Sherzod Omonov",
            contact: "+998 97 123 45 67",
            login: "sherzodomomov",
            password: "she*******",
        },
        {
            id: 5,
            name: "Islomjon Sodikov",
            contact: "+998 91 123 45 67",
            login: "islomjonsodikov",
            password: "isl*******",
        },
    ]

    return (
        <>
            <Card>
                <CardHeader className='flex justify-between items-center'>
                    <div className='w-full flex flex-col justify-start items-start gap-1'>
                        <CardTitle>Список агентов</CardTitle>
                        <CardDescription>Список действующих агентов</CardDescription>
                    </div>
                    <Input placeholder='Поиск...' className='max-w-[300px] px-10' />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>№</TableHead>
                                <TableHead>Имя/Фамилия</TableHead>
                                <TableHead>Номер телефона</TableHead>
                                <TableHead>Логин</TableHead>
                                <TableHead>Пароль</TableHead>
                                <TableHead>Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {agents.map((agent, idx) => (
                                <TableRow className='text-left'>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{agent.name}</TableCell>
                                    <TableCell>{agent.contact}</TableCell>
                                    <TableCell>{agent.login}</TableCell>
                                    <TableCell>{agent.password}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => {
                                                console.log(agent);
                                            }}
                                        >
                                            <Edit className="h-4 w-4 text-cLightBlue" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => {
                                                console.log(agent);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
};