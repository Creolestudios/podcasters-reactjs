import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './tooltip.scss';

interface IProps {
  children: any;
  tooltipProps?: any;
  overlayProps?: any;
  tooltip: any;
  className?: string;
  trigger?: any;
}

const TooltipWrapper: React.FC<IProps> = ({
  children,
  tooltipProps,
  overlayProps,
  tooltip,
  className,
  trigger,
}) => {
  const overlayTooltip = (
    // eslint-disable-next-line
    <Tooltip {...tooltipProps} className={tooltipProps?.className}>
      {tooltip}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      overlay={overlayTooltip}
      // eslint-disable-next-line
      {...overlayProps}
      trigger={trigger}
      className={overlayProps?.className}
    >
      <span id={tooltipProps?.id || ''} className={className}>
        {children}
      </span>
    </OverlayTrigger>
  );
};

export default TooltipWrapper;

TooltipWrapper.defaultProps = {
  overlayProps: {
    trigger: ['click', 'hover'],
    placement: 'top',
    delayShow: 300,
    delayHide: 200,
    rootClose: true,
  },
  tooltipProps: null,
  className: '',
  trigger: ['hover', 'focus'],
};
