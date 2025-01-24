import React from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { deleteRequest } from "@/lib/apiHandlers";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function DeleteModal({
    item,
    children,
    path,
    isPage,
    onUpdate
}: {
    item: any;
    children: React.ReactNode;
    path: string;
    isPage?: boolean
    onUpdate?: () => void
}) {
    const navigate = useNavigate();
    const deleteItem = async (item: any) => {
        const res = await deleteRequest({ url: `${path}/${item.id}` });
        console.log(res);


        if (res.status === 200 || res.status === 201) {
            onUpdate && onUpdate();
            isPage && navigate(-1);
        } else {
            toast({
                title: "Ошибка",
                description: "Произошла ошибка при удалении, попробуйте еще раз",
                variant: "destructive",
            })
        }
    };

    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Вы действительно хотите удалить?</DialogTitle>
                    <DialogDescription>Это действие нельзя отменить</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2"></div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button
                            onClick={() => deleteItem(item)}
                            type="button"
                            variant="custom"
                        >
                            Да!
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
