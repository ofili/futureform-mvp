import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ComparePartnersModalProps {
    projectId: string;
    assessments: Array<{
        id: string;
        partnerName: string;
        status: string;
        domainScores: Array<{ domain: string; score: number }>;
    }>;
    onClose: () => void;
}

export default function ComparePartnersModal({ projectId, assessments, onClose }: ComparePartnersModalProps) {
    // Extract all unique domains from assessments
    const allDomains = Array.from(
        new Set(assessments.flatMap(a => a.domainScores.map(ds => ds.domain)))
    ).sort();

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Partner Comparison</DialogTitle>
                </DialogHeader>

                <div className="overflow-x-auto mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Domain</TableHead>
                                {assessments.map(partner => (
                                    <TableHead key={partner.id} className="text-center font-bold text-black dark:text-white">
                                        {partner.partnerName}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Overall Score Row */}
                            <TableRow className="bg-muted/50">
                                <TableCell className="font-bold">Overall Trust Score</TableCell>
                                {assessments.map(partner => {
                                    const avg = Math.round(
                                        partner.domainScores.reduce((sum, ds) => sum + ds.score, 0) /
                                        (partner.domainScores.length || 1)
                                    );
                                    return (
                                        <TableCell key={partner.id} className="text-center">
                                            <Badge variant={avg >= 80 ? 'default' : avg >= 60 ? 'secondary' : 'destructive'} className="text-lg px-3 py-1">
                                                {avg}%
                                            </Badge>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>

                            {/* Domain Rows */}
                            {allDomains.map(domain => (
                                <TableRow key={domain}>
                                    <TableCell className="font-medium">{domain}</TableCell>
                                    {assessments.map(partner => {
                                        const score = partner.domainScores.find(ds => ds.domain === domain)?.score;
                                        return (
                                            <TableCell key={partner.id} className="text-center">
                                                {score !== undefined ? (
                                                    <span className={
                                                        score >= 80 ? 'text-green-600 font-medium' :
                                                            score >= 60 ? 'text-yellow-600' : 'text-red-600'
                                                    }>
                                                        {score}%
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
