import {SaleOfProductPage} from "../../pages/SaleOfProductPage";
import {JobTitlePages} from "../../pages/JobTitlePages";
import {UnitPage} from "../../pages/UnitPage";
import {EmployeePage} from "../../pages/EmployeePage";
import {RawMaterialPage} from "../../pages/RawMaterialPage";

export const routers = [
    {url: '/sale-of-products', name: 'Sale of products', element: <SaleOfProductPage/>},
    {url: '/budget', name: 'Budget', element: <>2</>},
    {url: '/employee', name: 'Employee', element: <EmployeePage/>},
    {url: '/job-title', name: 'Job title', element: <JobTitlePages/>},
    {url: '/production', name: 'Production', element: <></>},
    {url: '/purchase-raw-materials', name: 'Purchase raw materials', element: <></>},
    {url: '/raw-materials', name: 'Raw materials', element: <RawMaterialPage/>},
    {url: '/units', name: 'Units', element: <UnitPage/>},
    {url: '/finished-production', name: 'Finished production', element: <></>},
    {url: '/ingredients', name: 'Ingredients', element: <></>},
]
