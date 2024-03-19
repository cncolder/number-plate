import {
  Checkbox,
  ConfigProvider,
  Flex,
  Input,
  Table,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState, type FC } from 'react';
import data from './data.json';
import {
  expandNumberScope,
  matchIncrementalNumber,
  matchNumberOnly,
  matchPentaNumber,
  matchQuadraNumber,
  matchSearchKeyword,
  matchTripleNumber,
} from './utils';

export const App: FC = () => {
  const [keyword, setKeyword] = useState('');
  const [isNumericOnly, setIsNumericOnly] = useState(false);
  const [isExcludeFour, setIsExcludeFour] = useState(false);
  const [isTripleNumber, setIsTripleNumber] = useState(false);
  const [isIncrementalNumber, setIsIncrementalNumber] = useState(false);

  const dataSource = useMemo(() => {
    return data.numberScopes
      .flatMap((numberScope) =>
        expandNumberScope([numberScope.start]).map((key) => ({
          ...numberScope,
          key,
          level: matchPentaNumber(key)
            ? 5
            : matchQuadraNumber(key)
              ? 4
              : matchTripleNumber(key)
                ? 3
                : matchIncrementalNumber(key)
                  ? 2
                  : 1,
        })),
      )
      .sort((a, b) => a.key.localeCompare(b.key))
      .filter(
        (item) =>
          matchSearchKeyword(item.key, keyword) &&
          (isNumericOnly ? matchNumberOnly(item.key) : true) &&
          (isExcludeFour ? !item.key.includes('4') : true) &&
          (isTripleNumber ? item.level >= 3 : true) &&
          (isIncrementalNumber ? item.level === 2 : true),
      );
  }, [
    keyword,
    isNumericOnly,
    isExcludeFour,
    isTripleNumber,
    isIncrementalNumber,
  ]);

  return (
    <ConfigProvider>
      <Typography.Title>Number Plate</Typography.Title>
      <Table
        size="small"
        virtual
        scroll={{ y: 800 }}
        pagination={false}
        title={() => (
          <Flex gap={32} align="center">
            <Input.Search
              placeholder="Search"
              style={{ width: 360 }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
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
          </Flex>
        )}
        footer={() => (
          <Flex justify="end">
            <Typography.Text>共 {dataSource.length} 条</Typography.Text>
          </Flex>
        )}
        columns={[
          {
            title: '号牌',
            dataIndex: 'key',
            render: (value, record) => (
              <Tag
                style={{
                  fontFamily: 'monospace',
                  fontSize: 14 + 4 * record.level,
                  cursor: 'pointer',
                }}
                bordered={false}
                color={record.type.includes('新能源') ? 'green' : 'blue'}
              >
                {value.split('').join(' ')}
              </Tag>
            ),
          },
          { title: '牌证发放机关', dataIndex: 'office' },
          { title: '号牌种类', dataIndex: 'type' },
          {
            title: '投放日期',
            dataIndex: 'time',
            render: (value) => {
              return (
                <span
                  style={{
                    opacity: (100 - dayjs().diff(dayjs(value), 'days')) / 100,
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
    </ConfigProvider>
  );
};
