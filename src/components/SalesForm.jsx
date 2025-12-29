import { useState, useRef, useEffect } from 'react'
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
    font-size: 16px;
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

// 경고 메시지 스타일
const Warning = styled.div`
    margin: 12px 0;
    padding: 10px 12px;
    background: rgba(255, 59, 48, 0.06);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.12);
    border-radius: 6px;
    font-size: 13px;
`
const Discount = styled.div`
    margin: 12px 0;
    padding: 10px 12px;
    background: rgba(88, 48, 255, 0.06);
    color: #444fefff;
    border: 1px solid rgba(88, 68, 239, 0.12);
    border-radius: 6px;
    font-size: 13px;
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

// 추가: Gap 버튼 스타일
const GapButton = styled.button`
    appearance: none;
    border: 1px solid ${vars.border};
    background: ${vars.card};
    color: ${vars.muted};
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
`
const GapDisplay = styled.div`
    font-size: 13px;
    color: ${vars.muted};
    padding: 6px 8px;
    display: inline-flex;
    align-items: center;
`

const STORAGE_KEY = 'sales_form_data'

// 초기 폼 상태 (로컬스토리지에서 불러온 데이터로 덮어쓰기 전 상태)
const initialForm = {
    totalSales: '',
    cardSales: '',
    cashSales: '',
    seoulPay: '',
    bankTransfer: '',
    cash: '',
    employee: '',
    sejong: '',
    milion: '',
    naver: '',
}

export default function SalesForm({ onSubmit }) {
    const previewRef = useRef(null)
    const saveTimer = useRef(null)
    const [form, setForm] = useState(initialForm)

    const [submitted, setSubmitted] = useState(null)

    // 복사 상태
    const [copied, setCopied] = useState(false)

    // 자동 저장: 초기 로드 및 디바운스 저장
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setForm((prev) => ({ ...prev, ...JSON.parse(raw) }))
        } catch (err) {
            console.error('저장 불러오기 실패', err)
        }
    }, [])

    useEffect(() => {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
            } catch (err) {
                console.error('저장 실패', err)
            }
        }, 500)
        return () => {
            if (saveTimer.current) clearTimeout(saveTimer.current)
        }
    }, [form])

    const clearSaved = () => {
        localStorage.removeItem(STORAGE_KEY)
        setForm(initialForm)
        setSubmitted(null)
        setCopied(false)
    }

    // 레이블과 금액 사이 공백(스페이스) 수 조절 (0칸 기준으로 시작)
    const [gapSpaces, setGapSpaces] = useState(0)
    const increaseGap = () => setGapSpaces((s) => Math.min(15, s + 1))
    const decreaseGap = () => setGapSpaces((s) => Math.max(0, s - 1))

    // 총매출과 카드+현금 합계 불일치 검사 (소수점 오차 허용)
    const totalsMismatch =
        Math.abs(
            (Number(form.totalSales) || 0) -
                ((Number(form.cardSales) || 0) + (Number(form.cashSales) || 0))
        ) > 0.001

    const cashMismatch =
        Math.abs(
            (Number(form.cashSales) || 0) -
                ((Number(form.seoulPay) || 0) +
                    (Number(form.bankTransfer) || 0) +
                    (Number(form.cash) || 0))
        ) > 0.001

    const discountsSum =
        (Number(form.employee) || 0) +
        (Number(form.sejong) || 0) +
        (Number(form.milion) || 0)
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

    const formatReport = (dateTitle, f) => {
        const lines = []
        lines.push(`${dateTitle} 매출보고`)
        lines.push('')

        // 주요 항목(네이버예약 제외), 할인 항목은 따로 처리
        const mainRows = [
            ['총매출:', Number(f.totalSales) || 0],
            ['카드매출:', Number(f.cardSales) || 0],
            ['현금매출:', Number(f.cashSales) || 0],
            ['(서울페이 포함금액)', null],
            ['서울페이:', Number(f.seoulPay) || 0],
            ['계좌이체:', Number(f.bankTransfer) || 0],
            ['현금입금:', Number(f.cash) || 0],
        ]

        const discountRows = [
            ['직원할인:', Number(f.employee) || 0],
            ['세종할인:', Number(f.sejong) || 0],
            ['100만원이상5%할인:', Number(f.milion) || 0],
        ]

        const naverRow = ['네이버예약:', Number(f.naver) || 0]

        // 금액 문자열 길이 계산 (전체 항목 고려해서 정렬 통일)
        const allAmountCandidates = [
            ...mainRows.map(([, v]) =>
                v === null ? '' : `${v.toLocaleString()}원`
            ),
            ...discountRows.map(([, v]) => `${v.toLocaleString()}원`),
            `${(Number(f.naver) || 0).toLocaleString()}원`,
        ]
        const maxAmtLen = allAmountCandidates.reduce(
            (mx, s) => Math.max(mx, (s || '').length),
            0
        )
        const maxLabelLen = Math.max(
            ...mainRows.map(([lab]) => lab.length),
            ...discountRows.map(([lab]) => lab.length),
            naverRow[0].length
        )

        // 레이블과 금액 사이에 들어갈 공백 문자열 (사용자가 조절)
        const gap = ' '.repeat(Math.max(0, gapSpaces))

        // 출력: mainRows
        mainRows.forEach(([label, value]) => {
            if (value === null) {
                lines.push(
                    `${``.padEnd(maxLabelLen - 3)}${label.padStart(maxAmtLen)}`
                )
                return
            }

            const amt = `${Number(value).toLocaleString()}원`
            if (label === '서울페이:') {
                lines.push(
                    `             (${label.padEnd(maxLabelLen - 6)}${amt.padStart(maxAmtLen)})`
                )
                return
            }
            lines.push(
                `${label.padEnd(maxLabelLen)}${gap}${amt.padStart(maxAmtLen)}`
            )
        })

        // 할인 항목: 모든 할인 값이 0이면 '할인: 0원'으로 하나만 표시
        const discountsSum = discountRows.reduce(
            (s, [, v]) => s + (Number(v) || 0),
            0
        )
        if (discountsSum === 0) {
            const left = '할인:'.padEnd(maxLabelLen + 4)
            const right = '0원'.padStart(maxAmtLen)
            lines.push(`${left}${gap}${right}`)
        } else {
            discountRows.forEach(([label, value]) => {
                if (Number(value) === 0) return
                const amt = `${Number(value).toLocaleString()}원`
                lines.push(
                    `${label.padEnd(maxLabelLen)}${gap}${amt.padStart(maxAmtLen)}`
                )
            })
        }

        // 네이버예약 (항상 마지막)
        const naverAmt = `${Number(naverRow[1]).toLocaleString()}원`
        lines.push(
            `${naverRow[0].padEnd(maxLabelLen - 2)}${gap}${naverAmt.padStart(maxAmtLen)}`
        )

        return lines.join('\n')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) return
        const payload = { ...form }

        const today = new Date()
        const weekdayNames = ['일', '월', '화', '수', '목', '금', '토']
        const titleDate = `${String(today.getMonth() + 1).padStart(2, '0')}월 ${String(today.getDate()).padStart(2, '0')}일 (${weekdayNames[today.getDay()]})`
        const report = formatReport(titleDate, payload)

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
        { name: 'totalSales', label: '총매출' },
        { name: 'cardSales', label: '카드매출' },
        { name: 'cashSales', label: '현금매출' },
        { name: 'seoulPay', label: '서울페이' },
        { name: 'bankTransfer', label: '계좌이체' },
        { name: 'cash', label: '현금입금' },
        { name: 'employee', label: '직원할인' },
        { name: 'sejong', label: '세종할인' },
        { name: 'milion', label: '100만원이상할인' },
        { name: 'naver', label: '네이버예약' },
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
                                    </InputGroup>
                                </Label>
                            </Field>
                        )
                    )}
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
                    <CopyButton
                        type="button"
                        onClick={clearSaved}
                        style={{ marginLeft: 8 }}>
                        저장 지우기
                    </CopyButton>

                    {/* 레이블-금액 공백 조절 UI */}
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 8,
                            marginLeft: 8,
                        }}>
                        <GapButton type="button" onClick={decreaseGap}>
                            -
                        </GapButton>
                        <GapDisplay>
                            {' '
                                .repeat(Math.min(5, gapSpaces))
                                .replace(/ /g, '·')}
                        </GapDisplay>
                        <GapButton type="button" onClick={increaseGap}>
                            +
                        </GapButton>
                    </div>
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
