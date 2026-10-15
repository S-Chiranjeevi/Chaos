"""Service for analyzing menstrual cycle history, statistics, and regularity patterns."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List, Optional
from ..schemas.cycle import CycleInterval, CycleResponse

DISCLAIMER = "This is information, not a diagnosis."


class CycleService:
    """Computes cycle lengths, clinical regularity classifications, and predictions."""

    @staticmethod
    def analyze_cycle(period_start_dates: List[str]) -> CycleResponse:
        """Parse period start dates, calculate intervals and statistical metrics."""
        # Convert to dates, deduplicate, and sort chronologically
        parsed_dates = sorted(list({
            datetime.strptime(d.strip(), "%Y-%m-%d").date()
            for d in period_start_dates
        }))

        if len(parsed_dates) == 0:
            return CycleResponse(
                cycles=[],
                regularity="insufficient_data",
                insights=["No valid period start dates provided."],
                disclaimer=DISCLAIMER,
            )

        if len(parsed_dates) == 1:
            single_date = parsed_dates[0]
            predicted = (single_date + timedelta(days=28)).isoformat()
            return CycleResponse(
                cycles=[],
                average_cycle_length=None,
                shortest_cycle=None,
                longest_cycle=None,
                variation_days=None,
                regularity="insufficient_data",
                predicted_next_period=predicted,
                insights=[
                    "Only one period date recorded. Log at least two consecutive periods to calculate your cycle length and identify patterns.",
                    f"Estimated next period based on standard 28-day cycle: {predicted}."
                ],
                urgency="routine",
                disclaimer=DISCLAIMER,
            )

        # Calculate consecutive intervals
        cycles: List[CycleInterval] = []
        lengths: List[int] = []

        for i in range(len(parsed_dates) - 1):
            d1 = parsed_dates[i]
            d2 = parsed_dates[i + 1]
            diff = (d2 - d1).days
            if diff > 0:
                cycles.append(CycleInterval(
                    start_date=d1.isoformat(),
                    end_date=d2.isoformat(),
                    length_days=diff
                ))
                lengths.append(diff)

        if not lengths:
            return CycleResponse(
                cycles=[],
                regularity="insufficient_data",
                insights=["Could not determine cycle intervals from the dates provided."],
                disclaimer=DISCLAIMER,
            )

        avg_length = round(sum(lengths) / len(lengths), 1)
        shortest = min(lengths)
        longest = max(lengths)
        variation = longest - shortest

        # Determine clinical regularity (ACOG guidelines: normal is 21 to 35 days, variation < 8 days)
        has_long = any(l > 35 for l in lengths)
        has_short = any(l < 21 for l in lengths)
        high_variation = variation >= 8

        if has_long or has_short or high_variation:
            regularity = "irregular"
        elif variation >= 5:
            regularity = "variable"
        else:
            regularity = "regular"

        # Predicted next period
        last_date = parsed_dates[-1]
        predicted_date = (last_date + timedelta(days=int(round(avg_length)))).isoformat()

        # Construct educational insights
        insights: List[str] = []
        if has_long:
            insights.append(
                f"Your average cycle length is {avg_length} days, with cycles reaching up to {longest} days. "
                "Cycles longer than 35 days are classified clinically as oligomenorrhea and are a primary feature investigated during PCOS evaluations."
            )
        elif has_short:
            insights.append(
                f"Your shortest cycle was {shortest} days. Cycles under 21 days (polymenorrhea) warrant evaluation with a healthcare provider."
            )
        else:
            insights.append(
                f"Your average cycle length of {avg_length} days falls within the standard 21–35 day range."
            )

        if high_variation:
            insights.append(
                f"Your cycle lengths show notable variability ({variation} days difference between longest and shortest cycle)."
            )
        else:
            insights.append(
                f"Your cycle length is relatively consistent, varying by only {variation} days."
            )

        urgency = "soon" if (avg_length >= 45 or variation >= 15) else "routine"

        return CycleResponse(
            cycles=cycles,
            average_cycle_length=avg_length,
            shortest_cycle=shortest,
            longest_cycle=longest,
            variation_days=variation,
            regularity=regularity,
            predicted_next_period=predicted_date,
            insights=insights,
            urgency=urgency,
            disclaimer=DISCLAIMER,
        )


cycle_service = CycleService()
