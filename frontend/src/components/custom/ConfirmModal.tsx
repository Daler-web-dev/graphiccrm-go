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


interface ConfirmModalProps {
    children: React.ReactNode;
    setState: (state: boolean) => void;
    title: string;
}

export default function ConfirmModal({ children, setState, title }: ConfirmModalProps) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Это действие нельзя отменить</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2"></div>
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button
                            onClick={() => setState(true)}
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
