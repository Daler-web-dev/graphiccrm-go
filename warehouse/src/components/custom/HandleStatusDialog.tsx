import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { postRequest } from "@/lib/apiHandlers";

interface handleStatusChangeDialogProps {
    orderId: string;
    currentStatus:
    | "pending"
    | "in_production"
    | "ready"
    | "delivered"
    | "accepted"
    | "rejected";
    onChanged?: (newStatus: handleStatusChangeDialogProps["currentStatus"]) => void;
}

export const HandleStatusChangeDialog: React.FC<handleStatusChangeDialogProps> = ({
    orderId,
    currentStatus,
    onChanged,
}) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const [submitting, setSubmitting] = useState(false);

    const handleStatusChange = async (
        value: handleStatusChangeDialogProps["currentStatus"]
    ) => {
        if (value === status) return;
        setSubmitting(true);

        const res = await postRequest({
            url: `/warehouse/${orderId}/${value}`,
        });

        if (res.status === 200 || res.status === 201) {
            toast({
                title: "Успех",
                description: "Статус заказа успешно изменён",
            });
            setStatus(value);
            onChanged?.(value);
            setOpen(false);
        } else if (res.data.message == "Order cannot be ready from 'accepted' status") {
            toast({
                title: "Ошибка",
                description: "Невозможно изменить статус заказа на готово с статуса 'Принят'",
                variant: "destructive",
            });
        } else if (res.data.message == "Order cannot be delivered from 'accepted' status") {
            toast({
                title: "Ошибка",
                description: "Невозможно изменить статус заказа на доставлено с статуса 'Принят'",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Ошибка",
                description: "Произошла ошибка при изменении статуса заказа",
                variant: "destructive",
            });
        }
        setSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="custom" className="px-10">
                    Изменить статус
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Изменить статус заказа</DialogTitle>
                </DialogHeader>

                <RadioGroup
                    value={status}
                    onValueChange={handleStatusChange}
                    className="flex flex-col gap-4"
                    disabled={submitting}
                >
                    <label className="flex items-center gap-3">
                        <RadioGroupItem value="in_production" id="status-inprod" />
                        <span>На производстве</span>
                    </label>

                    <label className="flex items-center gap-3">
                        <RadioGroupItem value="ready" id="status-ready" />
                        <span>Готово</span>
                    </label>

                    <label className="flex items-center gap-3">
                        <RadioGroupItem value="delivered" id="status-delivered" />
                        <span>Доставлено</span>
                    </label>
                </RadioGroup>
            </DialogContent>
        </Dialog>
    );
};
