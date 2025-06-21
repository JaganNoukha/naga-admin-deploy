'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { createColumns } from '@/components/data-tables/orders/sales-return/columns';
import { Search } from 'lucide-react';
import { MasterRecordDropdown } from '@/components/shared/master-record-dropdown';
import { WarehouseDropdown } from '@/components/shared/warehouse-dropdown';
import { useRouter } from 'next/navigation';

const mockSalesReturns = [
	{
		date: '2024-06-01',
		name: 'Return #001',
		type: 'Damaged',
		criteriaType: 'Full',
		validity: '2024-06-10',
		productApplied: 'Product A',
		status: 'Pending',
		onViewLogs: () => alert('Logs for Return #001'),
	},
	{
		date: '2024-06-02',
		name: 'Return #002',
		type: 'Expired',
		criteriaType: 'Partial',
		validity: '2024-06-12',
		productApplied: 'Product B',
		status: 'Approved',
		onViewLogs: () => alert('Logs for Return #002'),
	},
	{
		date: '2024-06-03',
		name: 'Return #003',
		type: 'Damaged',
		criteriaType: 'Full',
		validity: '2024-06-15',
		productApplied: 'Product C',
		status: 'Rejected',
		onViewLogs: () => alert('Logs for Return #003'),
	},
];

export default function SalesReturnSection() {
	const [search, setSearch] = useState('');
	const [selectedWarehouse, setSelectedWarehouse] = useState<string | undefined>();
	const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
	const router = useRouter();

	const salesReturnsWithActions = mockSalesReturns.map(item => ({
		...item,
		onViewReport: () => router.push('/dashboard/orders/report-view'),
	}));

	return (
		<section className="w-full space-y-4 rounded-lg bg-white">
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="relative w-full md:w-1/3">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
					<Input
						placeholder="Search sales return"
						className="pl-10"
						value={search}
						onChange={e => setSearch(e.target.value)}
					/>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-2">
				<WarehouseDropdown
					value={selectedWarehouse}
					onChange={setSelectedWarehouse}
					placeholder="Warehouse"
					className="w-full"
				/>
				<MasterRecordDropdown
					masterName="status"
					value={selectedStatus}
					onChange={setSelectedStatus}
					placeholder="Status"
					className="w-full"
				/>
				<div />
				<div />
			</div>
			<div>
				<DataTable
					columns={createColumns()}
					data={salesReturnsWithActions}
				/>
			</div>
		</section>
	);
}
