export interface MedicineType {
    id: string | null;
    name: string | null;
    genericName: string | null;
    description: string | null;
    price: number | null;
    stock: number | null;
    manufacturer: string | null
    imageUrl: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    categoryId: string | null;
    sellerId: string | null;
}