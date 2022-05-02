import { FC, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TabPanel } from 'components/Tab';
import TabButton from 'components/Button/TabButton';
import useGetFuturesMarkets from 'queries/futures/useGetFuturesMarkets';
import FuturesMarketsTable from '../FuturesMarketsTable';

enum MarketsTab {
	FUTURES = 'futures',
	SPOT = 'spot',
}

const Markets: FC = () => {
	const { t } = useTranslation();

	const futuresMarketsQuery = useGetFuturesMarkets();
	const futuresMarkets = futuresMarketsQuery?.data ?? [];

	const [activeMarketsTab, setActiveMarketsTab] = useState<MarketsTab>(MarketsTab.FUTURES);

	const MARKETS_TABS = useMemo(
		() => [
			{
				name: MarketsTab.FUTURES,
				label: t('dashboard.overview.markets-tabs.futures'),
				active: activeMarketsTab === MarketsTab.FUTURES,
				onClick: () => {
					setActiveMarketsTab(MarketsTab.FUTURES);
				},
			},
			{
				name: MarketsTab.SPOT,
				label: t('dashboard.overview.markets-tabs.spot'),
				active: activeMarketsTab === MarketsTab.SPOT,
				disabled: true,
				onClick: () => {
					setActiveMarketsTab(MarketsTab.SPOT);
				},
			},
		],
		[activeMarketsTab, t]
	);

	return (
		<>
			<TabButtonsContainer>
				{MARKETS_TABS.map(({ name, label, active, disabled, onClick }) => (
					<TabButton
						key={name}
						title={label}
						active={active}
						disabled={disabled}
						onClick={onClick}
					/>
				))}
			</TabButtonsContainer>
			<TabPanel name={MarketsTab.FUTURES} activeTab={activeMarketsTab}>
				<FuturesMarketsTable futuresMarkets={futuresMarkets} />
			</TabPanel>

			<TabPanel name={MarketsTab.SPOT} activeTab={activeMarketsTab}></TabPanel>
		</>
	);
};

const TabButtonsContainer = styled.div`
	display: flex;
	margin-top: 16px;
	margin-bottom: 16px;

	& > button {
		height: 38px;
		font-size: 13px;

		&:not(:last-of-type) {
			margin-right: 14px;
		}
	}
`;

export default Markets;
