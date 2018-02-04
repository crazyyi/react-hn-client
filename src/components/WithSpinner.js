import React from 'react';
import Spinner from './Spinner';

const withSpinner = Comp => ({isLoading, children, ...props}) => {
    if (isLoading) {
        return <Spinner />
    } else {
        return (
            <Comp {...props}>
                {children}
            </Comp>
        )
    }
}

export default withSpinner;