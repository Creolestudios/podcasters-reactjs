import React, { FC } from 'react';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

import { getInTitleCase } from '../../utils';
import ActionMenuWrapper from '../Dropdown/ActionMenuWrapper';
import Pagination from '../Pagination';
import Loader from '../Loader/Loader';
import TooltipWrapper from '../Tooltip/TooltipWrapper';

import { IPagination, ITableAction } from '../../types';
import './index.scss';
import ButtonWrapper from '../form/ButtonWrapper';
import ColorStart from '../../assets/svg/ColorStart';

interface IColumn {
  value: string;
  key: string;
}

export interface IRequiredEllipsis {
  [columnNumber: number]: boolean;
}

interface IProps {
  columns: IColumn[];
  hasRatings?: boolean;
  hasStatus?: boolean;
  hasAction?: boolean;
  data: Record<string, any>[];
  noDataColSpan: number;
  action?: ITableAction;
  isPagination?: boolean;
  pagination?: IPagination;
  hasLoader?: boolean;
  isLoading?: boolean;
  isColumnLink?: boolean;
  linkColumns?: number[];
  onActionButton?: (type: string, id: string) => void;
}

const TableWrapper: FC<IProps> = ({
  columns,
  hasRatings,
  hasStatus,
  hasAction,
  data,
  noDataColSpan,
  action,
  isPagination,
  pagination,
  hasLoader,
  isLoading,
  isColumnLink,
  linkColumns,
  onActionButton,
}) => {
  const navigate = useNavigate();
  const getColumnValue = (row: Record<string, any>, column: IColumn) => {
    if (column.key.toLowerCase() === 'status' && hasStatus) {
      return (
        <span className={`${row[column.value].toLowerCase()} column-status`}>
          {getInTitleCase(row[column.value])}
        </span>
      );
    }
    if (column.key.toLowerCase() === 'views') {
      return row[column.value] || '-';
    }
    if (column.key.toLowerCase() === 'ratings' && hasRatings) {
      return row[column.value] ? (
        <div className='d-flex align-items-center gap-1'>
          <span className='h-100 my-auto'>{row[column.value]}</span>
          <span className='m-t-n6'>
            <ColorStart />
          </span>
        </div>
      ) : (
        '-'
      );
    }

    return row[column.value]?.length > 25
      ? `${row[column.value].slice(0, 25)}...`
      : row[column.value];
  };

  const getColumn = (
    row: Record<string, any>,
    column: IColumn,
    index: number,
  ) => {
    if (isColumnLink && linkColumns?.includes(index)) {
      return (
        <ButtonWrapper
          onClick={() => navigate(row?.slug, { state: row?.navigateState })}
          className='link link-text'
        >
          {getColumnValue(row, column)}
        </ButtonWrapper>
      );
    }
    return getColumnValue(row, column);
  };

  const handleAction = (type: string, id: string) => {
    if (onActionButton) {
      onActionButton(type, id);
    }
  };

  return (
    <div className='user-table table-container'>
      <Table className='table bg-white'>
        <thead className='table-dark'>
          <tr>
            {columns
              && columns.length > 0
              && columns.map((column: IColumn) => (
                <th key={column.key}>{column.value}</th>
              ))}

            {hasAction && <th className='text-end'>Action</th>}
          </tr>
        </thead>
        {hasLoader && isLoading ? (
          <tbody>
            <tr className='table-loader-container'>
              {/* eslint-disable-next-line */}
              <td colSpan={noDataColSpan}>
                <Loader />
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className='table-body'>
            {data && data.length > 0 ? (
              data.map((row: Record<string, any>) => (
                <tr key={`${row.key}-${Math.random()}`}>
                  {columns
                    && columns.length > 0
                    && columns.map((column: IColumn, index: number) => (
                      <td
                        key={`${row[column.value]}-${Math.random()}`}
                        className='column-wrapper'
                      >
                        {column.value.toLowerCase() !== 'name' ? (
                          getColumn(row, column, index)
                        ) : (
                          <TooltipWrapper
                            tooltip={row[column.value]}
                            overlayProps={{ placement: 'top' }}
                            key={`${row[column.value]}-${Math.random()}`}
                            className='tooltip-wrapper'
                          >
                            {getColumn(row, column, index)}
                          </TooltipWrapper>
                        )}
                      </td>
                    ))}

                  {hasAction && action && Object.keys(action).length > 0 && (
                    // eslint-disable-next-line
                    <td align='right' id={row.key}>
                      {action && (
                        <ActionMenuWrapper
                          MenuIcon={action.MenuIcon}
                          items={action.items}
                          slugId={row.key}
                          id={row.id} // Use id key in row of the data
                          onClick={(type: string) => handleAction(type, row.id)}
                          conditionalItem={
                            /* Use conditionalItem in the row of data
                              if conditional action item required */
                            Object.keys(row).includes('conditionalItem')
                              ? row?.conditionalItem
                              : undefined
                          }
                          disabled={row.disabled}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td className='no-data' colSpan={noDataColSpan} align='center'>
                  No Record Found
                </td>
              </tr>
            )}
          </tbody>
        )}
      </Table>
      {isPagination && pagination && data.length > 0 && (
        <Pagination
          current={pagination.current}
          onChange={pagination.onChange}
          pageSize={pagination.pageSize}
          total={pagination.total}
        />
      )}
    </div>
  );
};

TableWrapper.defaultProps = {
  hasAction: false,
  hasRatings: false,
  hasStatus: false,
  action: {
    MenuIcon: null,
    items: [],
  },
  isPagination: false,
  pagination: {
    current: 1,
    onChange: () => {},
    pageSize: 1,
    total: 1,
  },
  hasLoader: false,
  isLoading: false,
  isColumnLink: false,
  linkColumns: [],
  onActionButton: () => {},
};

export default TableWrapper;
