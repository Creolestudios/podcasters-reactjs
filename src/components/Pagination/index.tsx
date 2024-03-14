import React, { FC, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { IPagination } from '../../types';

import './index.scss';

const Pagination: FC<IPagination> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(3);
  const [startValue, setStartValue] = useState<number>(1);
  const [endValue, setEndValue] = useState<number>(pageSize);

  const totalPages = total && total > pageSize ? Math.ceil(total / pageSize) : 1;
  const getPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  useEffect(() => {
    setStart(current < 4 ? 0 : current - 2);
    setEnd(total && total < pageSize ? 1 : current + 2);
    setStartValue(1);
    setEndValue(total && total < pageSize ? total : pageSize);
  }, [total]);

  const handlePage = (page: number) => {
    setStartValue(page * pageSize - pageSize + 1);
    setEndValue(Math.min(page * pageSize, total || 0));
    onChange(page);
  };
  const handlePrev = () => {
    onChange(current - 1);
    setStartValue((current - 2) * pageSize + 1);
    setEndValue(Math.min((current - 1) * pageSize, total || 0));
    if (current - 1 === start) {
      const _start: number = start - 1;
      setStart(_start);
      setEnd(end - 1);
    }
  };

  const handleNext = () => {
    onChange(current + 1);
    setStartValue(current * pageSize + 1);
    setEndValue(Math.min((current + 1) * pageSize, total || 0));
    if (current === end) {
      const _start: number = start + 1;
      setStart(_start);
      setEnd(_start + 3);
    }
  };

  return (
    <div className='table-border-top d-flex align-items-center justify-content-between flex-wrap table-bottom-bar'>
      <div className='number-of-data'>
        {total && (
          <p className='mb-0'>
            SHOWING
            {' '}
            {startValue}
            {' '}
            TO
            {' '}
            {endValue}
            {' '}
            OF
            {' '}
            {total}
            {' '}
            ENTRIES
          </p>
        )}
      </div>
      <div className='pagination'>
        <ul className='list-unstyled mb-0'>
          <li className='list-inline-item'>
            <Button
              className='prev-btn'
              disabled={current === 1}
              onClick={handlePrev}
            >
              PREV
            </Button>
          </li>

          {getPages.slice(start, end).map((page: number) => (
            <li
              key={page}
              className={`list-inline-item number ${
                current === page ? 'active' : ''
              }`}
            >
              <Button
                className='prev-btn page-btn'
                onClick={() => handlePage(page)}
              >
                {page}
              </Button>
            </li>
          ))}
          <li className='list-inline-item'>
            <Button
              className='prev-btn'
              disabled={current === totalPages}
              onClick={handleNext}
            >
              NEXT
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Pagination;
