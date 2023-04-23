import router from 'next/router';
import React, { memo, useCallback, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

import EligibleIcon from 'assets/svg/app/eligible.svg';
import LinkArrowIcon from 'assets/svg/app/link-arrow.svg';
import Badge from 'components/Badge';
import { InfoBoxRow } from 'components/InfoBox';
import { FlexDivRow, FlexDivRowCentered } from 'components/layout/flex';
import { Body } from 'components/Text';
import { NO_VALUE } from 'constants/placeholder';
import ROUTES from 'constants/routes';
import Connector from 'containers/Connector';
import { selectTradePreview } from 'state/futures/selectors';
import { useAppSelector } from 'state/hooks';
import {
	selectStakedEscrowedKwentaBalance,
	selectStakedKwentaBalance,
} from 'state/staking/selectors';
import { formatDollars } from 'utils/formatters/number';

import TradeTotalFeesRow from './TradeTotalFeesRow';

export const TradePanelFeeInfo = memo(() => {
	return (
		<FeeInfoBoxContainer>
			<TradeTotalFeesRow />
			<LiquidationRow />
			<TradingRewardRow />
		</FeeInfoBoxContainer>
	);
});

const TradingRewardRow = memo(() => {
	const { t } = useTranslation();
	const { walletAddress } = Connector.useContainer();
	const stakedEscrowedKwentaBalance = useAppSelector(selectStakedEscrowedKwentaBalance);
	const stakedKwentaBalance = useAppSelector(selectStakedKwentaBalance);

	const isRewardEligible = useMemo(
		() => !!walletAddress && stakedKwentaBalance.add(stakedEscrowedKwentaBalance).gt(0),
		[walletAddress, stakedKwentaBalance, stakedEscrowedKwentaBalance]
	);

	const goToRewards = useCallback(() => {
		router.push(ROUTES.Dashboard.Rewards);
	}, []);

	return (
		<InfoBoxRow
			title="Trading Reward"
			compactBox
			value=""
			keyNode={
				<CompactBox $isEligible={isRewardEligible} onClick={goToRewards}>
					<FlexDivRow style={{ marginBottom: '5px' }}>
						<div>{t('dashboard.stake.tabs.trading-rewards.trading-reward')}</div>
						<Badge color="gray">
							{t(`dashboard.stake.tabs.trading-rewards.${isRewardEligible ? '' : 'not-'}eligible`)}
							{isRewardEligible ? (
								<EligibleIcon viewBox="0 0 8 8" style={{ paddingLeft: '2px' }} />
							) : (
								<EligibleIcon viewBox="0 0 8 8" style={{ paddingLeft: '2px' }} />
							)}
						</Badge>
					</FlexDivRow>
					<FlexDivRowCentered>
						<Body color="secondary">
							<Trans
								i18nKey={`dashboard.stake.tabs.trading-rewards.stake-to-${
									isRewardEligible ? 'earn' : 'start'
								}`}
								components={[<Body weight="bold" inline />]}
							/>
						</Body>
						<StyledLinkArrowIcon />
					</FlexDivRowCentered>
				</CompactBox>
			}
		/>
	);
});

const LiquidationRow = memo(() => {
	const potentialTradeDetails = useAppSelector(selectTradePreview);

	return (
		<InfoBoxRow
			title="Liquidation price"
			color="preview"
			value={
				potentialTradeDetails?.liqPrice ? formatDollars(potentialTradeDetails.liqPrice) : NO_VALUE
			}
		/>
	);
});

const FeeInfoBoxContainer = styled.div`
	margin-bottom: 16px;
`;

const StyledLinkArrowIcon = styled(LinkArrowIcon)`
	cursor: pointer;
	fill: ${(props) => props.theme.colors.selectedTheme.text.label};
`;

const CompactBox = styled.div<{ $isEligible: boolean }>`
	font-size: 13px;
	padding-left: 10px;
	cursor: pointer;
	margin-top: 10px;

	${(props) => `
		color: ${props.theme.colors.selectedTheme.text.value};
		border-left: 2px solid 
			${props.theme.colors.selectedTheme.badge.gray.background};
		`}
`;

export default TradePanelFeeInfo;