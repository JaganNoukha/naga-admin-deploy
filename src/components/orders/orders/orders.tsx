'use client';

import { createColumns } from '@/components/data-tables/orders/orders/columns';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { PlusIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

const mockOrders = [
	{
		outletName: 'ABC Retailers',
		outletType: 'Retail',
		orderDate: '2024-06-01',
		orderId: 'ORD001',
		weight: 120,
		amount: 15000,
		warehouse: 'Warehouse 1',
		status: 'Pending',
		onOrderDetails: () => alert('Order Details for ORD001'),
		onViewLogs: () => alert('Logs for ORD001'),
	},
	{
		outletName: 'XYZ Distributors',
		outletType: 'Distributor',
		orderDate: '2024-06-02',
		orderId: 'ORD002',
		weight: 200,
		amount: 25000,
		warehouse: 'Warehouse 2',
		status: 'Completed',
		onOrderDetails: () => alert('Order Details for ORD002'),
		onViewLogs: () => alert('Logs for ORD002'),
	},
	{
		outletName: 'LMN Wholesale',
		outletType: 'Wholesale',
		orderDate: '2024-06-03',
		orderId: 'ORD003',
		weight: 180,
		amount: 22000,
		warehouse: 'Warehouse 3',
		status: 'Cancelled',
		onOrderDetails: () => alert('Order Details for ORD003'),
		onViewLogs: () => alert('Logs for ORD003'),
	},
];

export default function OrdersSection() {
	const [search, setSearch] = useState('');
	const [selectedOutletType, setSelectedOutletType] = useState<string | undefined>();
	const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>();
	const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>();

	return (
		<section className="w-full space-y-4 rounded-lg bg-white ">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="relative w-full md:w-1/3">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
					<Input
						placeholder="Search orders"
						className="pl-10"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
				<Button className="w-full md:w-auto">
					<PlusIcon className="mr-2 h-4 w-4" />
					Place Order
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				<MasterRecordDropdown
					masterName="outletType"
					value={selectedOutletType}
					onChange={setSelectedOutletType}
					placeholder="Outlet Type"
					className="w-full"
				/>
				<WarehouseDropdown
					value={selectedWarehouse}
					onChange={setSelectedWarehouse}
					placeholder="Warehouse"
					className="w-full"
				/>
				<DatePicker
					value={selectedDate}
					onChange={setSelectedDate}
					placeholder="Select Date"
					className="w-full"
				/>
				<MasterRecordDropdown
					masterName="status"
					value={selectedStatus}
					onChange={setSelectedStatus}
					placeholder="Status"
					className="w-full"
				/>
			</div>
			<div>
				<DataTable columns={createColumns()} data={mockOrders} />
			</div>
		</section>
	);
}