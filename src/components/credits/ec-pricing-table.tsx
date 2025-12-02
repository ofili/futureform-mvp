'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ECPricingTable() {
    const pricingData = [
        {
            layer: "Assessment Evidence (AE)",
            description: "Self-reported data and basic document uploads",
            items: [
                { type: "Standard Response", cost: "0 EC", note: "Included with RC" },
                { type: "Document Upload", cost: "1 EC", note: "Per file (PDF, DOCX, etc.)" },
                { type: "Link Submission", cost: "0.5 EC", note: "Per URL" },
            ]
        },
        {
            layer: "Verification Evidence (VE)",
            description: "Third-party verified data and expert reviews",
            items: [
                { type: "Analyst Review", cost: "50 EC", note: "Per hour of analyst time" },
                { type: "Identity Check", cost: "5 EC", note: "Per individual verification" },
                { type: "Company Check", cost: "10 EC", note: "Per entity verification" },
            ]
        },
        {
            layer: "Digital Signal Evidence (DSE)",
            description: "Automated technical signals and API integrations",
            items: [
                { type: "API Signal Check", cost: "0.1 EC", note: "Per API call" },
                { type: "Continuous Monitoring", cost: "10 EC", note: "Per asset / month" },
                { type: "Log Analysis", cost: "5 EC", note: "Per GB of logs processed" },
            ]
        }
    ];

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Evidence Credit (EC) Pricing
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>1 EC ≈ $1.00 USD. Bulk discounts available.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardTitle>
                <CardDescription>
                    Transparent, consumption-based pricing for evidence processing and verification.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {pricingData.map((layer, index) => (
                        <div key={index} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{layer.layer}</h3>
                                <Badge variant="outline" className="text-xs font-normal">
                                    {layer.description}
                                </Badge>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[40%]">Evidence Type</TableHead>
                                        <TableHead className="w-[30%]">Cost</TableHead>
                                        <TableHead className="w-[30%]">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {layer.items.map((item, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium">{item.type}</TableCell>
                                            <TableCell>{item.cost}</TableCell>
                                            <TableCell className="text-muted-foreground text-sm">{item.note}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
