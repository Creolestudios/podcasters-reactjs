import React from 'react';

const ProfileIcon = ({
  height = '30',
  width = '30',
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={width || '30'}
    height={height || '30'}
    viewBox='0 0 30 30'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='img-fluid me-3'
  >
    <rect opacity='0.24' width='30' height='30' rx='6' fill='#9244EB' />
    <path
      d='M19.7616 15.1118C19.7045 15.0534 19.6364 15.007 19.5611 14.9752C19.4859 14.9435 19.4051 14.927 19.3234 14.9268C19.2418 14.9265 19.1609 14.9426 19.0855 14.9739C19.01 15.0053 18.9416 15.0513 18.8842 15.1094C18.8268 15.1675 18.7815 15.2364 18.751 15.3121C18.7204 15.3879 18.7053 15.4689 18.7064 15.5506C18.7075 15.6323 18.7249 15.7129 18.7575 15.7878C18.7901 15.8626 18.8373 15.9303 18.8963 15.9868C19.4184 16.5005 19.8326 17.1134 20.1146 17.7894C20.3967 18.4654 20.5408 19.1909 20.5387 19.9234C20.5387 20.676 18.3812 21.7695 15.0002 21.7695C11.6192 21.7695 9.46176 20.6755 9.46176 19.9221C9.45968 19.1947 9.60192 18.4741 9.88024 17.802C10.1586 17.1299 10.5674 16.5196 11.0832 16.0066C11.1415 15.9498 11.188 15.8819 11.2199 15.8069C11.2517 15.7319 11.2684 15.6514 11.2689 15.5699C11.2695 15.4884 11.2538 15.4077 11.2229 15.3323C11.1919 15.2569 11.1463 15.1885 11.0887 15.1309C11.0311 15.0733 10.9626 15.0277 10.8873 14.9967C10.8119 14.9658 10.7311 14.9501 10.6497 14.9506C10.5682 14.9511 10.4877 14.9678 10.4127 14.9997C10.3377 15.0316 10.2698 15.0781 10.213 15.1364C9.58245 15.7636 9.08262 16.5096 8.74241 17.3313C8.4022 18.153 8.22837 19.034 8.23099 19.9234C8.23099 21.9219 11.7184 23.0003 15.0002 23.0003C18.2821 23.0003 21.7694 21.9219 21.7694 19.9234C21.7722 19.028 21.596 18.1412 21.2512 17.3149C20.9064 16.4887 20.4 15.7396 19.7616 15.1118Z'
      fill='#9244EB'
    />
    <path
      d='M15.0001 15.6154C15.8521 15.6154 16.6849 15.3627 17.3933 14.8894C18.1017 14.4161 18.6538 13.7433 18.9799 12.9562C19.3059 12.169 19.3912 11.3029 19.225 10.4673C19.0588 9.63169 18.6485 8.86414 18.0461 8.2617C17.4436 7.65925 16.6761 7.24899 15.8405 7.08277C15.0049 6.91656 14.1387 7.00187 13.3516 7.32791C12.5645 7.65394 11.8917 8.20607 11.4184 8.91447C10.945 9.62286 10.6924 10.4557 10.6924 11.3077C10.6937 12.4498 11.148 13.5447 11.9555 14.3522C12.7631 15.1598 13.858 15.6141 15.0001 15.6154ZM15.0001 8.23077C15.6086 8.23077 16.2035 8.41123 16.7095 8.74933C17.2155 9.08742 17.6099 9.56797 17.8428 10.1302C18.0757 10.6924 18.1366 11.3111 18.0179 11.908C17.8992 12.5048 17.6061 13.0531 17.1758 13.4834C16.7455 13.9137 16.1972 14.2068 15.6004 14.3255C15.0035 14.4442 14.3848 14.3833 13.8226 14.1504C13.2604 13.9175 12.7798 13.5231 12.4417 13.0171C12.1036 12.5111 11.9232 11.9163 11.9232 11.3077C11.9241 10.4919 12.2486 9.70987 12.8254 9.13304C13.4022 8.55622 14.1843 8.23173 15.0001 8.23077Z'
      fill='#9244EB'
    />
  </svg>
);

export default ProfileIcon;
