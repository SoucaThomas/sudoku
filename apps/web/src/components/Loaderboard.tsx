"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Spinner } from "./ui/spinner";
import { User } from "../../auth";
import { Button } from "./ui/button";
import { Dialog, DialogDescription, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { getLeaderboard } from "../actions/action";

export default function Leaderboard() {
    const [loading, setLoading] = useState(false);
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
        <Card className="w-full h-full justify-center items-center">
            {users.length < 10 ? (
                <CardTitle className="p-3 text-xl w-full h-full flex items-center justify-center">
                    Not enough information
                </CardTitle>
            ) : loading ? (
                <div className="w-full h-2/3 flex items-center justify-center">
                    <Spinner size="lg" className="bg-black dark:bg-white" />
                </div>
            ) : (
                <>
                    <CardContent className="w-full h-full overflow-y-scroll">
                        <CardTitle className="p-3 text-xl">Leaderboards</CardTitle>
                        <div className="w-full">
                            {users.slice(0, 10).map((user, index) => {
                                return (
                                    <Table key={index} className="border-red-100">
                                        <TableBody className="border-red-100">
                                            <TableRow className="text-center h-2 border-red-100">
                                                <TableCell className="text-sm">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {user.totalScore}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                );
                            })}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full" variant={"outline"}>
                                        Show All
                                    </Button>
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
                                                    <TableCell className="text-sm">
                                                        {user.name}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {user.totalScore}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {user.gamesPlayed}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </>
            )}
            <CardFooter className="sticky -bottom-10 w-full"></CardFooter>
        </Card>
    );
}
