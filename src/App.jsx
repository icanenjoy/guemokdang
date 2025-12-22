import React, { useState } from 'react'
import styled from 'styled-components'
import CheckForm from './components/CheckForm'
import SalesForm from './components/SalesForm'
import InternetForm from './components/InternetForm'
import LastForm from './components/LastForm'
import ServiceForm from './components/ServiceForm'

const vars = {
    bg: '#f3f6fb',
    card: '#ffffff',
    muted: '#6b7280',
    accent: '#1f6feb',
    radius: '12px',
    pad: '20px',
    gap: '24px',
    maxWidth: '1100px',
}

const AppContainer = styled.div`
    min-height: 100vh;
    background: ${vars.bg};
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    box-sizing: border-box;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR',
        'Helvetica Neue', Arial;
`

const Card = styled.div`
    width: 100%;
    max-width: ${vars.maxWidth};
    background: ${vars.card};
    border-radius: ${vars.radius};
    padding: ${vars.pad};
    box-shadow: 0 8px 30px rgba(17, 24, 39, 0.06);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: ${vars.gap};
`

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`

const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
`

const Title = styled.h1`
    margin: 0;
    font-size: 20px;
    color: #0f172a;
    font-weight: 700;
`

const Subtitle = styled.div`
    font-size: 13px;
    color: ${vars.muted};
`

const TabGroup = styled.div`
    display: flex;
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
    padding: 8px 14px;
    font-size: 14px;
    cursor: pointer;
    font-weight: 600;
    transition:
        background 0.12s ease,
        color 0.12s ease;
`

const Content = styled.main`
    display: block;
`

export default function App() {
    const [active, setActive] = useState('feedback') // 'feedback' | 'sales'

    return (
        <AppContainer>
            <Card>
                <TabGroup role="tablist" aria-label="view tabs">
                    <TabButton
                        type="button"
                        active={active === 'feedback'}
                        onClick={() => setActive('feedback')}
                        aria-pressed={active === 'feedback'}>
                        메뉴 피드백
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'sales'}
                        onClick={() => setActive('sales')}
                        aria-pressed={active === 'sales'}>
                        매출
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'internet'}
                        onClick={() => setActive('internet')}
                        aria-pressed={active === 'internet'}>
                        인터넷 발주
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'last'}
                        onClick={() => setActive('last')}
                        aria-pressed={active === 'last'}>
                        마감보고
                    </TabButton>
                    <TabButton
                        type="button"
                        active={active === 'service'}
                        onClick={() => setActive('service')}
                        aria-pressed={active === 'service'}>
                        양갱 서비스
                    </TabButton>
                </TabGroup>

                <Content>
                    {active === 'feedback' && (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>메뉴 피드백</Title>
                                    <Subtitle>
                                        일별 판매/피드백을 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <CheckForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'sales' && (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>매출 기록</Title>
                                    <Subtitle>
                                        매출을 입력하세요 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <SalesForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'internet' && (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>인터넷 발주</Title>
                                    <Subtitle>
                                        인터넷 발주를 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <InternetForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'last' && (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>마감보고</Title>
                                    <Subtitle>
                                        마감 보고서를 작성하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <LastForm onSubmit={() => {}} />
                        </>
                    )}
                    {active === 'service' && (
                        <>
                            <Header>
                                <TitleGroup>
                                    <Title>양갱 서비스</Title>
                                    <Subtitle>
                                        양갱 서비스를 기록하세요
                                    </Subtitle>
                                </TitleGroup>
                            </Header>
                            <ServiceForm onSubmit={() => {}} />
                        </>
                    )}
                </Content>
            </Card>
        </AppContainer>
    )
}
