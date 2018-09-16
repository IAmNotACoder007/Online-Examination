import React, { Component } from 'react'
import Finished from '@material-ui/icons/CheckCircle';

class Thankyou extends Component {
    render() {
        const holderStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
        }
        return (
            <div className="thankyou-page-holder" style={holderStyle}>
                <h1>Thank You!</h1>
                <Finished style={{ height: "150px", width: '150px', color: "green" }} ></Finished>
                <p>
                    Your administrator will contact you soon!!
                </p>
            </div>
        )
    }
}

export default Thankyou;