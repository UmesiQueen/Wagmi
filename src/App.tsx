// import React from "react";
import { useSendTransaction, useAccount } from "wagmi";
import { parseEther } from "viem";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import ClipLoader from "react-spinners/ClipLoader";
import { Toaster, toast } from "sonner";

function App() {
	return (
		<>
			<div className="p-10 max-w-[1440px] mx-auto">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold">My Wallet</h2>
					<w3m-button />
				</div>
				<div className="mt-20">
					<SendTransaction />
				</div>
			</div>
			<Toaster
				position="top-center"
				expand={true}
				richColors
				toastOptions={{
					className: "p-3",
				}}
			/>
		</>
	);
}

export default App;

const formSchema = z.object({
	address: z.string({ required_error: "Provide a wallet address" }),
	value: z.string({ required_error: "Amount cannot be empty" }),
});

function SendTransaction() {
	const form = useForm({
		resolver: zodResolver(formSchema),
		mode: "onChange",
	});
	const {
		data: hash,
		sendTransaction,
		isSuccess,
		isError,
		isPending,
		...send
	} = useSendTransaction();

	const { isConnected } = useAccount();
	const isDisabled = (isPending || !isConnected) && true;
	// onError
	if (isError) {
		toast.error(send.failureReason?.shortMessage);
	}

	//Onsuccess
	if (isSuccess) {
		toast.success("Transaction confirmed.");
		form.reset();
	}

	const handleSubmit = form.handleSubmit((formData) => {
		toast.message("Confirm transaction", {
			description: "Confirm transaction request in the wallet",
		});
		sendTransaction({
			to: formData.address as `0x${string}`,
			value: parseEther(formData.value),
		});
	});

	return (
		<Card className="max-w-[600px] rounded-lg mx-auto p-10 bg-[#F1F1F1]">
			<Form {...form}>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-y-5 h-full min-h-[300px]"
				>
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-base">
									Send to:
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="0xA0Cf…251e"
										className="h-16 text-base px-5 border-[#181818]/50"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="value"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="font-medium text-base">Amount:</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="0.05"
										className="h-16 text-base px-5 border-[#181818]/50"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={isDisabled}
						className="h-16 w-full mt-5 text-xl"
						type="submit"
					>
						{isPending ? (
							<ClipLoader
								color="#fff"
								loading={isPending}
								size={20}
								aria-label="Loading Spinner"
							/>
						) : (
							" Send"
						)}
					</Button>
				</form>
			</Form>
			{hash && <div className="pt-5 text-sm">Transaction Hash: {hash}</div>}
		</Card>
	);
}
