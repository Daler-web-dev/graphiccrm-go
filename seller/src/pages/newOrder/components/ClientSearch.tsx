import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getRequest } from "@/lib/apiHandlers";
import { useDebounce } from "@/hooks/useDebounce";
import { IClient } from "@/models/clients";

interface ClientSearchProps {
    setValue: (value: string) => void;
}

export function ClientSearch({ setValue }: ClientSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [clients, setClients] = React.useState<IClient[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedClient, setSelectedClient] = React.useState<IClient | null>(null);

    const debouncedQuery = useDebounce(query, 500);

    React.useEffect(() => {
        if (!debouncedQuery) {
            setClients([]);
            return;
        }

        const fetchClients = async () => {
            setLoading(true);
            const response = await getRequest({
                url: `/clients/search?q=${debouncedQuery}`,
            });
            console.log(response);


            if (response.status === 200 || response.status === 201) {
                setClients(response.data.data);
                setLoading(false);
            } else {
                setClients([]);
                setLoading(false);
            }
        };

        fetchClients();
    }, [debouncedQuery]);

    const handleSelect = (client: IClient) => {
        setSelectedClient(client);
        setValue(client.id);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                >
                    {selectedClient ? selectedClient.name : "Выберите клиента..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Поиск клиента..."
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>Клиенты не найдены.</CommandEmpty>
                                <CommandGroup>
                                    {clients && clients.map((client) => (
                                        <CommandItem
                                            key={client.id}
                                            value={client.name}
                                            onSelect={() => handleSelect(client)}
                                        >
                                            {client.name} {client.surname}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    selectedClient?.id === client.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
