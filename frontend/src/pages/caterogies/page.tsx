import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

export const Categories: React.FC = () => {
    const [categories, setCategories] = useState<{ id: number; title: string }[]>([
        { id: 1, title: 'Категория 1' },
        { id: 2, title: 'Категория 2' },
        { id: 3, title: 'Категория 3' },
        { id: 4, title: 'Категория 4' },
    ]);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<{ id: number; title: string } | null>(null);
    const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null);

    const addCategory = () => {
        if (newCategory.trim()) {
            setCategories((prev) => [
                ...prev,
                { id: Date.now(), title: newCategory.trim() },
            ]);
            setNewCategory('');
        }
    };

    const closeModal = () => {
        setSelectedCategory(null);
        setModalType(null);
    };

    const handleEdit = (category: { id: number; title: string }) => {
        setSelectedCategory(category);
        setModalType('edit');
    };

    const handleDelete = (category: { id: number; title: string }) => {
        setSelectedCategory(category);
        setModalType('delete');
    };

    const confirmEdit = () => {
        setCategories((prev) =>
            prev.map((cat) =>
                cat.id === selectedCategory?.id ? { ...cat, title: selectedCategory.title } : cat
            )
        );
        closeModal();
    };

    const confirmDelete = () => {
        setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory?.id));
        closeModal();
    };

    return (
        <Card>
            <CardHeader className="flex flex-col justify-center items-start">
                <CardTitle>Категории</CardTitle>
                <CardDescription>Список категорий</CardDescription>
                <div className="flex gap-2 pt-5 w-full">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Добавить новую категорию"
                        className="w-full border rounded-lg p-2"
                    />
                    <Button onClick={addCategory} variant="secondary">
                        Добавить
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Наименование</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="text-left">{category.title}</TableCell>
                                <TableCell className="flex justify-end gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Edit className="h-4 w-4 text-cLightBlue" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => handleDelete(category)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {modalType && selectedCategory && (
                <UniversalModal
                    isOpen={!!modalType}
                    onClose={closeModal}
                    onConfirm={modalType === 'edit' ? confirmEdit : confirmDelete}
                    title={
                        modalType === 'edit' ? 'Редактировать категорию' : 'Удалить категорию'
                    }
                    description={
                        modalType === 'edit'
                            ? `Измените название категории "${selectedCategory.title}"`
                            : `Вы уверены, что хотите удалить категорию "${selectedCategory.title}"?`
                    }
                    confirmText={modalType === 'edit' ? 'Сохранить' : 'Удалить'}
                    cancelText="Отмена"
                >
                    {modalType === 'edit' && (
                        <input
                            type="text"
                            defaultValue={selectedCategory.title}
                            className="w-full border rounded p-2"
                            onChange={(e) =>
                                setSelectedCategory({ ...selectedCategory, title: e.target.value })
                            }
                        />
                    )}
                </UniversalModal>
            )}
        </Card>
    );
};

const UniversalModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText,
    cancelText,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmText: string;
    cancelText: string;
    children?: React.ReactNode;
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {description && <p className="mb-4">{description}</p>}
                    {children}
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-[#00BE13] text-white rounded-xl py-2 text-sm font-semibold hover:bg-[#00A311] transition"
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-[#D71B1B] text-white rounded-xl py-2 text-sm font-semibold hover:bg-[#B51818] transition"
                        >
                            {cancelText}
                        </button>
                    </div>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};
