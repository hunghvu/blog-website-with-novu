import React from 'react';

type Props = {
    purpose: string,
}

const TextField: React.FC<Props> = ({purpose}) => (
    <form style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "32px"
    }}>
        <label htmlFor="newsletter">Subscribe to newsletter</label>
        <input id="newsletter" type="text" placeholder={purpose}/>
        <input type="submit" value="Subscribe"/>
    </form>
)

export default TextField;
