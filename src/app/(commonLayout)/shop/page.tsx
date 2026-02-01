import { medicineService } from "@/services/medicine.service";
import { MedicineType } from "@/types/medicine,type";


const ShopPage = async () => {
    const { data } = await medicineService.getAllMedicine();
    console.log(data);

    return (
        <div>
            {
                data?.data?.data.map((item: MedicineType) => <p key={item.id}>{item.name}</p>)
            }
        </div>
    );
};

export default ShopPage;