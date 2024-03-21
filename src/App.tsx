import { useLocalStorageState, useMap, useSize } from "ahooks";
import {
	Badge,
	Checkbox,
	ConfigProvider,
	Divider,
	Flex,
	Input,
	Layout,
	Table,
	Typography,
} from "antd";
import dayjs from "dayjs";
import { type FC, useEffect, useMemo, useRef, useState } from "react";
import data from "./data.json";
import { theme } from "./theme";
import {
	expandNumberRange,
	matchIncrementalNumber,
	matchNumberOnly,
	matchPentaNumber,
	matchQuadraNumber,
	matchRepeatedNumber,
	matchSearchKeyword,
	matchTripleNumber,
} from "./utils";

export const App: FC = () => {
	const [keyword, setKeyword] = useState("");

	const [isSortByLevel, setIsSortByLevel] = useState(true);

	const [isStatusOnly, setIsStatusOnly] = useState(false);
	const [isNumericOnly, setIsNumericOnly] = useState(true);
	const [isExcludeFour, setIsExcludeFour] = useState(false);
	const [isTripleNumber, setIsTripleNumber] = useState(true);
	const [isIncrementalNumber, setIsIncrementalNumber] = useState(false);

	const contentRef = useRef<HTMLDivElement>(null);
	const contentSize = useSize(contentRef);
	const tableScrollY =
		(contentSize?.height || 500) -
		(contentRef.current?.querySelector(".ant-table-header")?.clientHeight || 0);

	/**
	 * 号牌缓存.
	 * status: 1: 收藏, -1: 排除.
	 */
	const [numberPlateCache = {}, setNumberPlateCache] = useLocalStorageState<{
		status?: Record<string, number>;
	}>("number-plate", { defaultValue: {} });

	const [numberPlateMap, numberPlateMapHelper] = useMap<string, number>(
		Object.entries(numberPlateCache.status || {}),
	);

	useEffect(() => {
		setNumberPlateCache({ status: Object.fromEntries(numberPlateMap) });
	}, [numberPlateMap, setNumberPlateCache]);

	const dataSource = useMemo(() => {
		return data.numberPool
			.flatMap((item) =>
				expandNumberRange(item.range).map((key) => ({
					...item,
					key,
					level: matchPentaNumber(key)
						? 5
						: matchQuadraNumber(key)
						  ? 4
						  : matchTripleNumber(key) || matchRepeatedNumber(key)
							  ? 3
							  : matchIncrementalNumber(key)
								  ? 2
								  : 1,
					status: numberPlateMap.get(key),
				})),
			)
			.sort((a, b) =>
				isSortByLevel && a.level !== b.level
					? b.level - a.level
					: a.key.localeCompare(b.key),
			)
			.filter(
				(item) =>
					matchSearchKeyword(item.key, keyword) &&
					(isStatusOnly ? item.status : true) &&
					(isNumericOnly ? matchNumberOnly(item.key) : true) &&
					(isExcludeFour ? !item.key.includes("4") : true) &&
					(isTripleNumber ? item.level >= 3 : true) &&
					(isIncrementalNumber ? item.level === 2 : true),
			);
	}, [
		keyword,
		isSortByLevel,
		isStatusOnly,
		isNumericOnly,
		isExcludeFour,
		isTripleNumber,
		isIncrementalNumber,
		numberPlateMap,
	]);

	type DataItem = (typeof dataSource)[number];

	return (
		<ConfigProvider theme={theme}>
			<Layout style={{ height: "100vh" }}>
				<Layout.Header>
					<Flex style={{ height: "100%" }} gap={32} align="center">
						<Input.Search
							placeholder="Search"
							style={{ width: 360 }}
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
						<Checkbox
							checked={isSortByLevel}
							onChange={(e) => setIsSortByLevel(e.target.checked)}
						>
							靓号榜
						</Checkbox>
						<Checkbox
							checked={isStatusOnly}
							onChange={(e) => setIsStatusOnly(e.target.checked)}
						>
							收藏夹
						</Checkbox>
						<Checkbox
							checked={isNumericOnly}
							onChange={(e) => setIsNumericOnly(e.target.checked)}
						>
							仅数字
						</Checkbox>
						<Checkbox
							checked={isExcludeFour}
							onChange={(e) => setIsExcludeFour(e.target.checked)}
						>
							不含4
						</Checkbox>
						<Checkbox
							checked={isTripleNumber}
							onChange={(e) => setIsTripleNumber(e.target.checked)}
						>
							豹子号
						</Checkbox>
						<Checkbox
							checked={isIncrementalNumber}
							onChange={(e) => setIsIncrementalNumber(e.target.checked)}
						>
							递增减
						</Checkbox>
						<Divider style={{ flex: 1 }} type="vertical" />
						<Typography.Title level={3}>🎰 Number Plate</Typography.Title>
					</Flex>
				</Layout.Header>
				<Layout.Content ref={contentRef} style={{ padding: "0 50px" }}>
					<Table<DataItem>
						size="small"
						virtual
						scroll={{
							y: tableScrollY,
						}}
						pagination={false}
						columns={[
							{
								title: "号牌",
								dataIndex: "key",
								render: (value: string, record) => (
									<Badge.Ribbon
										color="transparent"
										text={
											record.status === 1
												? "⭐️"
												: record.status === -1
												  ? "🚫"
												  : undefined
										}
									>
										<Typography.Text
											style={{
												fontSize: 14 + 4 * record.level,
												letterSpacing: record.level * 2,
												cursor: "pointer",
												textDecoration:
													record.status === -1 ? "line-through" : undefined,
											}}
											keyboard
											type={
												record.status === -1
													? "secondary"
													: record.level >= 5
													  ? "danger"
													  : record.level >= 4
														  ? "warning"
														  : record.level >= 3
															  ? "success"
															  : undefined
											}
											onClick={() => {
												const status = numberPlateMapHelper.get(value);
												if (status === 1) {
													numberPlateMapHelper.set(value, -1);
												} else if (status === -1) {
													numberPlateMapHelper.remove(value);
												} else {
													numberPlateMapHelper.set(value, 1);
												}
											}}
										>
											{value}
										</Typography.Text>
									</Badge.Ribbon>
								),
							},
							{ title: "牌证发放机关", dataIndex: "organization" },
							{ title: "号牌种类", dataIndex: "type" },
							{
								title: "投放日期",
								dataIndex: "time",
								render: (value) => {
									return (
										<span
											style={{
												opacity:
													(100 - dayjs().diff(dayjs(value), "days")) / 100,
											}}
										>
											{value.slice(0, 10)}
										</span>
									);
								},
							},
						]}
						dataSource={dataSource}
					/>
				</Layout.Content>
				<Layout.Footer>
					<Flex gap={8}>
						<Typography.Text>共 {dataSource.length} 条</Typography.Text>,
						<Typography.Text>
							收藏 {dataSource.filter((item) => item.status === 1).length}
						</Typography.Text>
						,
						<Typography.Text>
							排除 {dataSource.filter((item) => item.status === -1).length}
						</Typography.Text>
					</Flex>
				</Layout.Footer>
			</Layout>
		</ConfigProvider>
	);
};
