'use client';

import { columns } from '@/components/data-tables/grn/columns';
import SpringBoard from '@/components/shared/spring-board';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';



const GrnPage = () => {
	const router = useRouter();
	const grnTableData = [
		{
			id: '01',
			date: '25 May, 2025',
			outlet: 'SK Stores',
			invoiceNo: 'INV01',
			grnNo: 'GRN01',
			order: '12',
			quantity: '01',
			packages: '01',
			receivedPackages: '01',
			status: 'Delivered',
			onView: () => router.push('/dashboard/grn/outlet-view'),
		},
	];
	const [selected, setSelected] = useState('');

	return (
		<section className="w-full space-y-6">
			<div className="flex items-center justify-between">
				<div className="text-xl font-medium">GRN Receipt Note Approval</div>
				<SpringBoard />
			</div>

			<div className="rounded-lg bg-white p-4 space-y-4">
				<div className="flex items-center justify-between mb-2">
					<Select value={selected} onValueChange={setSelected}>
						<SelectTrigger className="w-64">
							<SelectValue placeholder="Select" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="option1">Option 1</SelectItem>
							<SelectItem value="option2">Option 2</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="default" onClick={() => router.push('/dashboard/grn/grn-overview')}>
						GRN Overview
					</Button>
				</div>
				<div className="flex items-center justify-between mb-4 bg-background rounded-lg p-2">
					<div className="text-lg font-medium">GRN Information</div>
					<Button variant="outline">Approve GRN</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div>
						<label className="block text-base font-normal mb-1">GRN NO</label>
						<div style={{ fontWeight: 500, fontSize: 16 }}>Sk Stores</div>
					</div>
					<div>
						<label className="block text-base font-normal mb-1">Received Date</label>
						<div style={{ fontWeight: 500, fontSize: 16 }}>25 May, 2025</div>
					</div>
					<div>
						<label className="block text-base font-normal mb-1">Total Ton</label>
						<div style={{ fontWeight: 500, fontSize: 16 }}>2</div>
					</div>
					<div>
						<label className="block text-base font-normal mb-1">Total Package</label>
						<div style={{ fontWeight: 500, fontSize: 16 }}>5</div>
					</div>
					<div>
						<label className="block text-base font-normal mb-1">Received Package</label>
						<div style={{ fontWeight: 500, fontSize: 16 }}>5</div>
					</div>
				</div>
			</div>

			<div className="rounded-lg bg-white p-4">
				<div className="bg-background mb-4 rounded-lg p-2 text-lg font-medium">
					Outlet Information
				</div>
				<DataTable columns={columns} data={grnTableData} />
			</div>
		</section>
	);
};

export default GrnPage;
