"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ChartOptions 
} from 'chart.js';
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Card Component Types
interface CardProps {
  children: ReactNode;
  className?: string;
  [x: string]: any;
}

function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardHeader({ children, className, ...props }: CardProps) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface ChurchData {
  members: number[];
  offering: number[];
  contribution: number[];
  tithe: number[];
}

type DataKey = keyof ChurchData;

interface DataItem {
  date: Timestamp;
  amount?: number;
  count?: number;
  id: string;
}



export default function Dashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [growthYear, setGrowthYear] = useState<string>(new Date().getFullYear().toString());
  const [memberCount, setMemberCount] = useState<number>(0);
  const [offeringCount, setOfferingCount] = useState<number>(0);
  const [contributionCount, setContributionCount] = useState<number>(0);
  const [titheCount, setTitheCount] = useState<number>(0);
  const [churchData, setChurchData] = useState<ChurchData>({
    members: [],
    offering: [],
    contribution: [],
    tithe: []
  });
  const [selectedDataType, setSelectedDataType] = useState<DataKey>('members');

  const formatXAF = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startDate = `${growthYear}-01-01`;
        const endDate = `${growthYear}-12-31`;
  
        const collections: DataKey[] = ['members', 'offering', 'contribution', 'tithe'];
        const fetchPromises = collections.map(async (collectionName) => {
          const q = query(
            collection(db, collectionName),
            where('date', '>=', startDate),
            where('date', '<=', endDate),
            orderBy('date')
          );
          const querySnapshot = await getDocs(q);
  
          console.log(`Data for ${collectionName}:`, querySnapshot.docs.map(doc => doc.data()));
  
          return { 
            collectionName, 
            data: querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as DataItem))
          };
        });
  
        const results = await Promise.all(fetchPromises);
  
        const newChurchData: ChurchData = {
          members: new Array(12).fill(0),
          offering: new Array(12).fill(0),
          contribution: new Array(12).fill(0),
          tithe: new Array(12).fill(0)
        };
  
        results.forEach(({ collectionName, data }) => {
          data.forEach((item: DataItem) => {
            let dateObject: Date;
        
            if (item.date instanceof Timestamp) {
              // Convert Firestore Timestamp to JavaScript Date
              dateObject = item.date.toDate();
            } else {
              // Parse the date string (assumes the date is a string in "YYYY-MM-DD" format)
              dateObject = new Date(item.date as unknown as string);
            }
        
            const month = dateObject.getMonth(); // Get month index (0-11)
        
            if (collectionName === 'members' && item.count !== undefined) {
              newChurchData[collectionName][month] = item.count;
            } else if (item.amount !== undefined) {
              newChurchData[collectionName][month] += item.amount;
            }
          });
        });
        
        console.log('Church Data:', newChurchData);
        setChurchData(newChurchData);
        const totalMembers = setMemberCount(newChurchData.members[newChurchData.members.length - 1]);
        const totalOffering = setOfferingCount(newChurchData.offering.reduce((a, b) => a + b, 0));
        const totalContribution = setContributionCount(newChurchData.contribution.reduce((a, b) => a + b, 0));
        const totalTithe = setTitheCount(newChurchData.tithe.reduce((a, b) => a + b, 0));

        console.log('Total Members:', totalMembers);
        console.log('Total Offering:', totalOffering);
        console.log('Total Contribution:', totalContribution);
        console.log('Total Tithe:', totalTithe);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [growthYear]);
  
  

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => selectedDataType === 'members' ? value : formatXAF(value as number)
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1)} Overview ${growthYear}`,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += selectedDataType === 'members' 
                ? context.parsed.y
                : formatXAF(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  const summaryCards = [
    { title: 'Total Members', value: memberCount, change: '+5%', color: 'bg-blue-500' },
    { title: `Offering ${growthYear}`, value: formatXAF(offeringCount), change: '+5%', color: 'bg-green-500' },
    { title: `Contribution ${growthYear}`, value: formatXAF(contributionCount), change: '-3%', color: 'bg-red-500' },
    { title: 'Tithe', value: formatXAF(titheCount), change: '', color: 'bg-purple-500' },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: selectedDataType.charAt(0).toUpperCase() + selectedDataType.slice(1),
        data: churchData[selectedDataType],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      }
    ]
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
  
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {summaryCards.map((card, index) => (
              <Card key={index} className={`${card.color} text-blcak`}>
                <CardHeader className="font-semibold">{card.title}</CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  {/**
                  {card.change.startsWith('+') ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {card.change}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <ArrowDownIcon className="w-4 h-4 mr-1" />
                      {card.change}
                    </div>
                  )} */}
                </CardContent>
              </Card>
            ))}
          </div>
  
          <Card className="mb-6">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Data Overview</h2>
              <div className="flex space-x-2">
                <select
                  className="border rounded p-1"
                  value={selectedDataType}
                  onChange={(e) => setSelectedDataType(e.target.value as DataKey)}
                >
                  <option value="members">Members</option>
                  <option value="offering">Offering</option>
                  <option value="contribution">Contribution</option>
                  <option value="tithe">Tithe</option>
                </select>
                <select
                  className="border rounded p-1"
                  value={growthYear}
                  onChange={(e) => setGrowthYear(e.target.value)}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );  
}