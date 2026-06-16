import React, { useState } from 'react'
import styled from 'styled-components'
import CheckForm from './pages/CheckForm'
import SalesForm from './pages/SalesForm'
import InternetForm from './pages/InternetForm'
import LastForm from './pages/LastForm'
import ServiceForm from './pages/ServiceForm'
import PorridgeForm from './pages/PorridgeForm'
import { vars } from './style'

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${vars.bg};
    padding: 40px 20px;
    box-sizing: border-box;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR',
        'Helvetica Neue', Arial;
`

const Card = styled.div`
    width: 100%;
    background: ${vars.card};
    border-radius: 12px;
    padding: 20px;
    box-shadow: 15px 30px 10px rgba(17, 24, 39, 0.06);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
`

const Subtitle = styled.div`
    font-size: 13px;
    color: ${vars.muted};
`

const TabGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    background: transparent;
    overflow: hidden;
    justify-content: space-between;
`

const TabButton = styled.button`
    width: 100%;
    appearance: none;
    border: none;
    background: ${(p) => (p.active ? vars.accent : 'transparent')};
    color: ${(p) => (p.active ? '#fff' : vars.muted)};
    padding: 15px 0px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    transition:
        background 0.2s ease,
        color 0.2s ease;
`

const Header = styled.header`
    margin-bottom: 20px;
`

const Title = styled.h1`
    margin-bottom: 3px;
    font-size: 20px;
    color: ${vars.main};
    font-weight: 700;
`

export default function App() {
    const [active, setActive] = useState('porridgeStock')

    return (
        <AppContainer>
            <Card>
                <TabGroup>
                    <TabButton
                        type="button"
                        active={active === 'porridgeStock'}
                        onClick={() => setActive('porridgeStock')}>
                        죽 재고
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'feedback'}
                        onClick={() => setActive('feedback')}>
                        메뉴 피드백
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'last'}
                        onClick={() => setActive('last')}>
                        마감보고
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'sales'}
                        onClick={() => setActive('sales')}>
                        매출
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'internet'}
                        onClick={() => setActive('internet')}>
                        인터넷 발주
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'service'}
                        onClick={() => setActive('service')}>
                        양갱 서비스
                    </TabButton>
                </TabGroup>

                <div>
                    {active === 'porridgeStock' && (
                        <>
                            <Header>
                                <Title>죽 재고</Title>
                                <Subtitle>죽 재고를 기록하세요</Subtitle>
                            </Header>
                            <PorridgeForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'feedback' && (
                        <>
                            <Header>
                                <Title>메뉴 피드백</Title>
                                <Subtitle>
                                    일별 판매/피드백을 기록하세요
                                </Subtitle>
                            </Header>
                            <CheckForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'sales' && (
                        <>
                            <Header>
                                <Title>매출 기록</Title>
                                <Subtitle>
                                    매출을 입력하세요 기록하세요
                                </Subtitle>
                            </Header>
                            <SalesForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'internet' && (
                        <>
                            <Header>
                                <Title>인터넷 발주</Title>
                                <Subtitle>인터넷 발주를 기록하세요</Subtitle>
                            </Header>
                            <InternetForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'last' && (
                        <>
                            <Header>
                                <Title>마감보고</Title>
                                <Subtitle>마감 보고서를 작성하세요</Subtitle>
                            </Header>
                            <LastForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'service' && (
                        <>
                            <Header>
                                <Title>양갱 서비스</Title>
                                <Subtitle>양갱 서비스를 기록하세요</Subtitle>
                            </Header>
                            <ServiceForm onSubmit={() => {}} />
                        </>
                    )}
                </div>
            </Card>
        </AppContainer>
    )
}
