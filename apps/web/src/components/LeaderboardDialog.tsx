import React, { useEffect, useState, ReactNode } from "react";
import { getLeaderboard } from "../actions/action";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { User } from "../../auth";
import { SquareDashedKanbanIcon } from "lucide-react";

interface LeaderboardDialogProps {
    isDialogOpen?: boolean;
    setIsDialogOpen?: (isDialogOpen: boolean) => void;
}

export default function LeaderboardDialog({
    isDialogOpen,
    setIsDialogOpen,
}: LeaderboardDialogProps) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([] as User[]);

    useEffect(() => {
        setLoading(true);
        getLeaderboard()
            .then((data) => {
                setUsers(data.map((user) => user as User));
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={(isOpen) => {
                if (setIsDialogOpen) {
                    setIsDialogOpen(isOpen);
                }
            }}
        >
            <DialogTrigger asChild>
                {!setIsDialogOpen && (
                    <Button className="w-full" variant={"outline"}>
                        Show All
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="w-full h-4/5 overflow-auto">
                <DialogTitle>Leaderboard</DialogTitle>
                <DialogDescription>all the scores</DialogDescription>
                <Table>
                    <TableHeader>
                        <TableRow className="text-center w-full">
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Games Played</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index} className="text-center h-2">
                                <TableCell className="text-sm">{user.name}</TableCell>
                                <TableCell className="text-sm">{user.totalScore}</TableCell>
                                <TableCell className="text-sm">{user.gamesPlayed}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
}
