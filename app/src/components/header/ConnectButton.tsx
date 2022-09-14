import React, { useEffect, useState } from 'react';
import { ContractService } from '../../services/contract-service';
import { UpdateProgressCallback, useAsyncWorker } from '../../utils/hooks';
import { Button } from '../styles/Button.styled';

// @refresh reset
export const ConnectButton = () => {
	const [isWalletReady, setIsWalletReady] = useState(false);
	const [userAddress, setUserAddress] = useState(undefined as undefined | string);
	const { loading, error, progress, doWork } = useAsyncWorker();

	const connectWallet = () => {
		doWork(async (stopIfUnmounted, updateProgress) => {
			await ContractService.connectWallet(updateProgress);
			const userAddress = await ContractService.getUserAddress();

			stopIfUnmounted();
			setIsWalletReady(!!userAddress);
			setUserAddress(userAddress);
		});
	};

	useEffect(() => {
		// Try to connect
		doWork(async (stopIfUnmounted, updateProgress) => {
			await ContractService.connectWallet(updateProgress, {reconnectOnly: true});
			const userAddress = await ContractService.getUserAddress();
			stopIfUnmounted();
			setIsWalletReady(!!userAddress);
			setUserAddress(userAddress);
		});
	}, []);

	return (
		<div>
			{loading && (
				<div className='loading'>
					loading... {progress.message}{' '}
					{(progress.ratioComplete * 100).toFixed(0)}%
				</div>
			)}
			{error && <div className='error'>{error.message}</div>}

			{!isWalletReady && (
				<>
					{/* <h3>Connect Wallet</h3> */}
					<Button onClick={connectWallet}>Connect</Button>
				</>
			)}
			{isWalletReady && (
				<>
					<h3>Connected</h3>
					<h5>{userAddress}</h5>
				</>
			)}
		</div>
	);
};
