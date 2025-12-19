import { useState, useRef } from 'react'
import styled from 'styled-components'

const vars = {
    bg: '#f8f9fb',
    card: '#ffffff',
    muted: '#6b7280',
    border: '#e6e9ef',
    accent: '#1f6feb',
    radius: '8px',
    pad: '16px',
}

const Container = styled.div`
    display: flex;
    gap: 24px;
    align-items: flex-start;

    box-sizing: border-box;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR',
        'Helvetica Neue', Arial;

    /* 모바일: 세로 스택 (폼 위, 결과 아래) */
    @media (max-width: 900px) {
        flex-direction: column;
    }
`

const FormWrapper = styled.form`
    flex: 1;
    min-width: 320px;
    max-width: 720px;
    background: transparent;
`

const Fields = styled.div`
    display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
`

const Field = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    box-sizing: border-box;
`

const Label = styled.label`
    display: flex;
    flex-direction: row;
    justify-content: space-between; /* 제목 왼쪽, 입력 오른쪽으로 정렬 */
    align-items: center;
    gap: 11px;
    width: 100%;
`

const Title = styled.div`
    font-size: 15px;
    color: #111827;
    font-weight: 600;
    display: flex;
    align-items: center;
    flex: 1; /* 왼쪽 끝에 붙게 차지 */
    text-align: left;
`

const FeedbackLabel = styled.label`
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 제목 왼쪽, 입력 오른쪽으로 정렬 */
    gap: 11px;
    width: 100%;
`

const FeedbackTitle = styled.div`
    font-size: 15px;
    color: #111827;
    font-weight: 600;
    display: flex;
    align-items: center;
    flex: 1; /* 왼쪽 끝에 붙게 차지 */
    text-align: left;
`

const NumberInput = styled.input.attrs({ type: 'number' })`
    padding: 8px 10px;
    border: 1px solid ${vars.border};
    border-radius: 6px;
    background: ${vars.card};
    outline: none;
    font-size: 14px;
    color: #111827;
    text-align: right;
    /* 너비 축소: 가로로 길지 않게 고정 */
    min-width: 64px;
    max-width: 96px;
    &:focus {
        border-color: rgba(31, 111, 235, 0.18);
        box-shadow: 0 6px 18px rgba(31, 111, 235, 0.06);
    }
`

/* 추가: 입력 + 스테퍼 그룹 스타일 */
const InputGroup = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
`

const Stepper = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 6px;
    overflow: hidden;
    background: transparent;
    border: 1px solid ${vars.border};
    height: 38px;
    box-sizing: border-box;
`

const StepButton = styled.button`
    appearance: none;
    border: none;
    background: ${vars.card};
    padding: 4px 8px;
    width: 32px;
    height: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    line-height: 1;
    color: #111827;

    &:active {
        transform: translateY(1px);
    }
    &:first-child {
        border-bottom: 1px solid ${vars.border};
    }

    @media (max-width: 600px) {
        width: 36px;
    }
`

const Preview = styled.aside`
    flex: 1;
    min-width: 300px;
    max-width: 520px;
    background: ${vars.bg};
    border-left: 1px solid ${vars.border};
    padding: ${vars.pad};
    border-radius: 6px;
    box-sizing: border-box;

    /* 모바일에서 결과가 폼 아래로 내려오도록 스타일 조정 */
    @media (max-width: 900px) {
        border-left: none;
        border-top: 1px solid ${vars.border};
        margin-top: 12px;
        max-width: 100%;
    }
`

const PreviewTitle = styled.div`
    font-weight: 700;
    margin-bottom: 8px;
`

const SubmittedTime = styled.div`
    font-size: 12px;
    color: ${vars.muted};
    margin-bottom: 12px;
`

const Pre = styled.pre`
    background: ${vars.card};
    padding: 12px;
    border-radius: 6px;
    border: 1px solid ${vars.border};
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, 'Noto Sans Mono', monospace;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 13px;
    color: #111827;
    margin: 0;
`

// 추가: 제출 내용 복사 버튼 스타일
const CopyButton = styled.button`
    margin-left: 8px;
    padding: 6px 10px;
    font-size: 13px;
    background: transparent;
    border: 1px solid ${vars.border};
    color: ${vars.muted};
    border-radius: 6px;
    cursor: pointer;
    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
`

const FixedSubmit = styled.button`
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    z-index: 1000;
    background: ${vars.accent};
    color: #fff;
    border: none;
    padding: 10px 18px;
    border-radius: 999px;
    box-shadow: 0 8px 30px rgba(31, 111, 235, 0.18);
    cursor: pointer;
    font-weight: 600;
    transition:
        transform 0.12s ease,
        box-shadow 0.12s ease,
        opacity 0.12s ease;

    /* hover 가능한 입력장치에서만 hover/active 적용 (데스크탑 전용) */
    @media (hover: hover) and (pointer: fine) {
        &:hover {
            transform: translateX(-50%) translateY(-3px);
            box-shadow: 0 12px 36px rgba(31, 111, 235, 0.22);
        }
        &:active {
            transform: translateX(-50%) translateY(0);
            opacity: 0.95;
        }
    }

    /* 모바일에서 버튼을 화면 폭에 맞게, 변형 제거하여 '도망' 현상 방지 */
    @media (max-width: 600px) {
        left: 16px;
        right: 16px;
        transform: none !important;
        width: calc(100% - 32px);
        bottom: 16px;
        border-radius: 12px;
    }
`
const Divider = styled.div`
    grid-column: 1 / -1;
    height: 1px;
    background: ${vars.border};
    border-radius: 2px;
    margin: 8px 0;
`
const TextInput = styled.input.attrs({ type: 'text' })`
    width: 100%;
    height: 40px;
    padding: 8px 10px;
    border: 1px solid ${vars.border};
    border-radius: 6px;
    font-size: 14px;
    color: #111827;
    background: ${vars.card};
    outline: none;
    box-sizing: border-box;
    &:focus {
        border-color: rgba(31, 111, 235, 0.18);
        box-shadow: 0 6px 18px rgba(31, 111, 235, 0.06);
    }
`

export default function CheckForm({ onSubmit }) {
    const previewRef = useRef(null)
    const [form, setForm] = useState({
        ssanghwaHotHall: '',
        ssanghwaIceHall: '',
        sujeonggwaHotHall: '',
        sujeonggwaIceHall: '',
        omijaHotHall: '',
        omijaIceHall: '',
        coffeeHotHall: '',
        coffeeIceHall: '',
        patjukHall: '',
        sweetPatjukHall: '',
        seoulHall: '',
        hodugwajaHall: '',
        lemonHall: '',
        pumkinHall: '',
        ssanghwaHotTakeout: '',
        ssanghwaIceTakeout: '',
        sujeonggwaHotTakeout: '',
        sujeonggwaIceTakeout: '',
        omijaHotTakeout: '',
        omijaIceTakeout: '',
        coffeeHotTakeout: '',
        coffeeIceTakeout: '',
        ssanghwabottle: '',
        sujeonggwaBottle: '',
        omijaBottle: '',
        patjukTakeout: '',
        sweetPatjukTakeout: '',
        seoulTakeout: '',
        hodoogwajaTakeout: '',
        lemonTakeout: '',
        patjukPouch: '',
        sweetPatjukPouch: '',
        pumkinPouch: '',
        // weight fields (소수점 허용)
        omijaWeight: '',
        ssanghwaWeight: '',
        sujeonggwaWeight: '',
        hodugwaWeight: '',
        // 서울빙수 자유 피드백
        seoulFeedback: '',
        lemonFeedback: '',
        patjukFeedback: '',
        sweetPatjukFeedback: '',
        pumkinFeedback: '',
        omijaFeedback: '',
        ssanghwaFeedback: '',
        sujeonggwaFeedback: '',
        coffeeFeedback: '',
        hodugwajaFeedback: '',
    })

    const [submitted, setSubmitted] = useState(null)

    // 복사 상태
    const [copied, setCopied] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setForm((prev) => ({ ...prev, [name]: checked }))
            return
        }
        if (type === 'number') {
            const parsed = parseFloat(value)
            const newValue = isNaN(parsed) ? 0 : parsed // 소수점 허용
            setForm((prev) => ({ ...prev, [name]: newValue }))
            return
        }
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        // 간단 검증: 모든 숫자가 음수가 아닌지 확인
        for (const key in form) {
            if (Object.prototype.hasOwnProperty.call(form, key)) {
                const v = form[key]
                if (typeof v === 'number' && v < 0) return false
            }
        }
        return true
    }

    const formatReport = (storeName, dateTitle, f) => {
        const lines = []
        lines.push(`${storeName} ${dateTitle}`)
        lines.push('메뉴 피드백 올려드립니다.\n')

        // helper
        const addMenu = (title, hallKey, takeoutKey, pouchKey, feedbackKey) => {
            const hall = f[hallKey] || 0
            const takeout = f[takeoutKey] || 0
            const pouch = pouchKey ? f[pouchKey] || 0 : null
            const feedback = f[feedbackKey] || ''

            lines.push(`•${title}`)
            lines.push(`총 판매 수량 : 매장 ${hall} + 포장 ${takeout}`)
            if (pouchKey) lines.push(`총 판매 수량(파우치) : 포장 ${pouch}`)
            lines.push(
                `직원 피드백 : ${feedback === '' ? (hall === 0 ? '-' : hall > 1 ? '모두 빈 그릇으로 회수되었습니다.' : '빈 그릇으로 회수되었습니다.') : feedback}\n`
            )
        }

        const addDrink = (
            title,
            iceHallKey,
            iceTakeoutKey,
            hotHallKey,
            hotTakeoutKey,
            bottleKey,
            feedbackKey
        ) => {
            const iceHall = f[iceHallKey] || 0
            const iceTake = f[iceTakeoutKey] || 0
            const hotHall = f[hotHallKey] || 0
            const hotTake = f[hotTakeoutKey] || 0
            const bottle = f[bottleKey] || 0
            const feedback = f[feedbackKey] || ''

            lines.push(`•${title}`)
            lines.push(
                `총 판매 수량 : 매장 ${iceHall} + 포장 ${iceTake} / 핫 ${hotHall} + 포장 ${hotTake} / 병입 ${bottle}`
            )
            lines.push(
                `직원 피드백 : ${feedback === '' ? (iceHall + hotHall === 0 ? '-' : iceHall + hotHall > 1 ? '모두 빈 잔으로 회수되었습니다.' : '빈 잔으로 회수되었습니다.') : feedback}\n`
            )
        }

        // Build each menu using available fields
        // 서울빙수
        addMenu('서울빙수', 'seoulHall', 'seoulTakeout', null, 'seoulFeedback')

        // 레몬 진저 빙수
        addMenu(
            '레몬진저빙수',
            'lemonHall',
            'lemonTakeout',
            null,
            'lemonFeedback'
        )

        // 금옥팥죽
        addMenu(
            '금옥팥죽',
            'patjukHall',
            'patjukTakeout',
            'patjukPouch',
            'patjukFeedback'
        )

        // 단팥죽
        addMenu(
            '단팥죽',
            'sweetPatjukHall',
            'sweetPatjukTakeout',
            'sweetPatjukPouch',
            'sweetPatjukFeedback'
        )

        // 단호박죽
        addMenu(
            '단호박죽',
            'pumkinHall',
            'pumkinTakeout',
            'pumkinPouch',
            'pumkinFeedback'
        )
        //오미자
        addDrink(
            `오미자 (총 ${f.omijaWeight || 0}kg)`,
            'omijaIceHall',
            'omijaIceTakeout',
            'omijaHotHall',
            'omijaHotTakeout',
            'omijaBottle',
            'omijaFeedback'
        )

        addDrink(
            `쌍화차 (조청 포함 총 ${f.ssanghwaWeight || 0}kg, 비정제 설탕 7g)`,
            'ssanghwaIceHall',
            'ssanghwaIceTakeout',
            'ssanghwaHotHall',
            'ssanghwaHotTakeout',
            'ssanghwabottle',
            'ssanghwaFeedback'
        )

        addDrink(
            `수정과 (사과즙 포함 총 ${f.sujeonggwaWeight || 0}kg)`,
            'sujeonggwaIceHall',
            'sujeonggwaIceTakeout',
            'sujeonggwaHotHall',
            'sujeonggwaHotTakeout',
            'sujeonggwaBottle',
            'sujeonggwaFeedback'
        )

        addDrink(
            `커피 `,
            'coffeeIceHall',
            'coffeeIceTakeout',
            'coffeeHotHall',
            'coffeeHotTakeout',
            'coffeeBottle',
            'coffeeFeedback'
        )

        // 호두과자
        {
            lines.push(`•호두과자 (${f.hodugwaWeight || 0}배치 제조)`)
            lines.push(
                `총 판매 수량 : ${(f.hodugwajaHall || 0) + (f.hodugwajaTakeout || 0)} 세트`
            )
            lines.push(
                `직원 피드백 : ${(f.hodugwajaFeedback || '') === '' ? ((f.hodugwajaHall || 0) + (f.hodugwajaTakeout || 0) === 0 ? '-' : '금일 특이사항 없습니다.') : f.hodugwajaFeedback}\n`
            )
        }

        return lines.join('\n')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        const payload = { ...form }

        const today = new Date()
        const weekdayNames = ['일', '월', '화', '수', '목', '금', '토']
        const titleDate = `${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일 (${weekdayNames[today.getDay()]})`
        const report = formatReport('[서초점]', titleDate, payload)

        setSubmitted(report)

        // 모바일(<=900px)에서 제출 시 결과 영역으로 스무스 스크롤
        if (
            typeof window !== 'undefined' &&
            window.innerWidth <= 900 &&
            previewRef.current
        ) {
            previewRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }

        if (onSubmit && typeof onSubmit === 'function') onSubmit(payload)
        else console.log('폼 제출:', payload)
    }

    const copySubmitted = async () => {
        if (!submitted) return
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(submitted)
            } else {
                // fallback
                const ta = document.createElement('textarea')
                ta.value = submitted
                document.body.appendChild(ta)
                ta.select()
                document.execCommand('copy')
                document.body.removeChild(ta)
            }
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('복사 실패', err)
        }
    }

    // helper: step으로 조절 (step은 number 또는 string)
    const adjust = (name, delta) => {
        setForm((prev) => {
            const cur = parseFloat(prev[name]) || 0
            const step = typeof delta === 'string' ? parseFloat(delta) : delta
            const next = Math.round((cur + step) * 1000) / 1000 // 소수 처리 안전하게
            return { ...prev, [name]: next }
        })
    }

    // Enter 누르면 다음 입력으로 포커스 이동 (버튼/비표시 요소 제외)
    const handleKeyDown = (e) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        const formEl =
            e.target.form ||
            (e.currentTarget &&
                e.currentTarget.closest &&
                e.currentTarget.closest('form'))
        if (!formEl) return

        // Enter 이동 대상은 입력 계열만 — 버튼/복사버튼 등 제외
        const selector =
            'input[type="number"], input[type="text"], input:not([type]), textarea, select'
        const nodes = Array.from(formEl.querySelectorAll(selector))

        const focusable = nodes.filter((el) => {
            if (!el) return false
            if (el.disabled) return false
            if (
                el.getAttribute &&
                el.getAttribute('data-skip-enter') === 'true'
            )
                return false
            // 화면상 보이는 요소만
            try {
                const rect = el.getBoundingClientRect()
                if (rect.width === 0 && rect.height === 0) return false
            } catch (err) {}
            return true
        })

        const idx = focusable.indexOf(e.target)
        if (idx === -1) {
            // 현재 요소가 리스트에 없으면 포커스 유지
            e.target.focus && e.target.focus()
            return
        }

        const next = focusable[idx + 1]
        if (next) {
            next.focus()
        } else {
            // 마지막 항목이면 포커스 유지 (사라지는 현상 방지)
            e.target.focus && e.target.focus()
        }
    }

    // field 정의로 렌더링 단순화 (각 항목에 스텝 설정 가능)
    const fieldDefs = [
        { name: 'omijaWeight', label: '오미자 무게', step: 0.01 },
        { name: 'ssanghwaWeight', label: '쌍화차 무게', step: 0.01 },
        { name: 'sujeonggwaWeight', label: '수정과 무게', step: 0.01 },
        { name: 'hodugwajaWeight', label: '호두과자 제조', step: 0.001 },
        { name: 'Divider' },
        { name: 'ssanghwaHotHall', label: '쌍화차[HOT]' },
        { name: 'sujeonggwaHotHall', label: '수정과[HOT]' },
        { name: 'sujeonggwaIceHall', label: '수정과[ICE]' },
        { name: 'omijaHotHall', label: '오미자[HOT]' },
        { name: 'omijaIceHall', label: '오미자[ICE]' },
        { name: 'coffeeHotHall', label: '커피[HOT]' },
        { name: 'coffeeIceHall', label: '커피[ICE]' },

        { name: 'patjukHall', label: '금옥팥죽' },
        { name: 'sweetPatjukHall', label: '단팥죽' },
        { name: 'seoulHall', label: '서울빙수' },
        { name: 'hodugwajaHall', label: '호두과자' },
        { name: 'lemonHall', label: '레몬진저빙수' },
        { name: 'ssanghwaIceHall', label: '쌍화차[ICE]' },
        { name: 'pumkinHall', label: '단호박죽' },
        { name: 'Divider' },
        { name: 'ssanghwaHotTakeout', label: '쌍화차[HOT](포장)' },
        { name: 'sujeonggwaHotTakeout', label: '수정과[HOT](포장)' },
        { name: 'sujeonggwaIceTakeout', label: '수정과[ICE](포장)' },
        { name: 'omijaHotTakeout', label: '오미자[HOT](포장)' },
        { name: 'omijaIceTakeout', label: '오미자[ICE](포장)' },
        { name: 'coffeeHotTakeout', label: '커피[HOT](포장)' },
        { name: 'coffeeIceTakeout', label: '커피[ICE]포장)' },

        { name: 'ssanghwabottle', label: '쌍화차 병' },
        { name: 'sujeonggwaBottle', label: '수정과 병' },
        { name: 'omijaBottle', label: '오미자 병' },

        { name: 'patjukTakeout', label: '금옥팥죽(포장)' },
        { name: 'sweetPatjukTakeout', label: '단팥죽(포장)' },
        { name: 'seoulTakeout', label: '서울빙수(포장)' },
        { name: 'hodugwajaTakeout', label: '호두과자(포장)' },
        { name: 'lemonTakeout', label: '레몬진저빙수(포장)' },
        { name: 'ssanghwaIceTakeout', label: '쌍화차[ICE](포장)' },

        { name: 'patjukPouch', label: '금옥팥죽 파우치' },
        { name: 'sweetPatjukPouch', label: '단팥죽 파우치' },
        { name: 'pumkinPouch', label: '호박죽 파우치' },
    ]

    return (
        <Container>
            <FormWrapper onSubmit={handleSubmit} noValidate>
                <Fields>
                    {fieldDefs.map((f) =>
                        f.name === 'Divider' ? (
                            <Divider key="divider" />
                        ) : (
                            <Field key={f.name}>
                                <Label>
                                    <Title>{f.label}</Title>
                                    <InputGroup>
                                        <NumberInput
                                            name={f.name}
                                            step={f.step || 1}
                                            value={form[f.name]}
                                            onChange={handleChange}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <Stepper aria-hidden>
                                            <StepButton
                                                type="button"
                                                aria-label={`증가 ${f.label}`}
                                                onClick={() =>
                                                    adjust(
                                                        f.name,
                                                        f.step !== undefined
                                                            ? f.step
                                                            : 1
                                                    )
                                                }>
                                                ▲
                                            </StepButton>
                                            <StepButton
                                                type="button"
                                                aria-label={`감소 ${f.label}`}
                                                onClick={() =>
                                                    adjust(
                                                        f.name,
                                                        f.step !== undefined
                                                            ? -f.step
                                                            : -1
                                                    )
                                                }>
                                                ▼
                                            </StepButton>
                                        </Stepper>
                                    </InputGroup>
                                </Label>
                            </Field>
                        )
                    )}
                    <Divider />

                    <Field key="seoul-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>서울빙수 피드백</FeedbackTitle>
                            <TextInput
                                name="seoulFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.seoulFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="lemon-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>레몬진저빙수 피드백</FeedbackTitle>
                            <TextInput
                                name="lemonFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.lemonFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="patjuk-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>금옥팥죽 피드백</FeedbackTitle>
                            <TextInput
                                name="patjukFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.patjukFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="sweetPatjuk-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>단팥죽 피드백</FeedbackTitle>
                            <TextInput
                                name="sweetPatjukFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.sweetPatjukFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="pumkin-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>단호박죽 피드백</FeedbackTitle>
                            <TextInput
                                name="pumkinFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.pumkinFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="omija-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>오미자 피드백</FeedbackTitle>
                            <TextInput
                                name="omijaFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.omijaFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="ssanghwa-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>쌍화차 피드백</FeedbackTitle>
                            <TextInput
                                name="ssanghwaFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.ssanghwaFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="sujeonggwa-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>수정과 피드백</FeedbackTitle>
                            <TextInput
                                name="sujeonggwaFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.sujeonggwaFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="coffee-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>커피 피드백</FeedbackTitle>
                            <TextInput
                                name="coffeeFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.coffeeFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>
                    <Field key="hodugwaja-feedback">
                        <FeedbackLabel>
                            <FeedbackTitle>호두과자 피드백</FeedbackTitle>
                            <TextInput
                                name="hodugwajaFeedback"
                                placeholder="직원 피드백 입력"
                                value={form.hodugwajaFeedback}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </FeedbackLabel>
                    </Field>

                    <Divider />
                </Fields>
            </FormWrapper>

            <Preview ref={previewRef}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginBottom: 8,
                    }}>
                    <PreviewTitle>제출 결과</PreviewTitle>
                    <CopyButton onClick={copySubmitted} disabled={!submitted}>
                        {copied ? '복사됨' : '복사'}
                    </CopyButton>
                </div>

                {submitted ? (
                    <>
                        <Pre>{submitted}</Pre>
                    </>
                ) : (
                    <SubmittedTime style={{ color: vars.muted }}>
                        아직 제출된 데이터가 없습니다.
                    </SubmittedTime>
                )}
            </Preview>

            <FixedSubmit type="button" onClick={handleSubmit}>
                제출
            </FixedSubmit>
        </Container>
    )
}
