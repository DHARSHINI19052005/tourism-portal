import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Footer } from '../footer/footer';

interface AnalyticsCard {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
}

@Component({
    selector: 'app-booking-analytics',
    standalone: true,
    imports: [CommonModule, Footer],
    templateUrl: './booking-analytics.html',
    styleUrls: ['./booking-analytics.css']
})
export class BookingAnalytics implements OnInit, AfterViewInit {

    @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

    userName = '';

    cards: AnalyticsCard[] = [
        { id: 'most-booked', title: 'Most Booked Locations', subtitle: 'Top destinations this month', icon: '🏆', color: '#6366f1' },
        { id: 'least-booked', title: 'Least Booked Locations', subtitle: 'Underexplored destinations', icon: '📍', color: '#f59e0b' },
        { id: 'booking-status', title: 'Booking Status', subtitle: 'Current booking health', icon: '📋', color: '#10b981' },
        { id: 'popularity', title: 'Destination Popularity', subtitle: 'Popularity insights %', icon: '🌟', color: '#8b5cf6' },
        { id: 'monthly-trend', title: 'Monthly Booking Trend', subtitle: 'Bookings over 6 months', icon: '📈', color: '#3b82f6' },
        { id: 'travel-mode', title: 'Travel Mode Split', subtitle: 'Flight, Train & Bus', icon: '✈️', color: '#ec4899' }
    ];

    // Mock analytics data
    private mostBookedData = {
        labels: ['Goa', 'Manali', 'Kerala', 'Rajasthan', 'Ooty'],
        values: [342, 287, 256, 213, 198]
    };

    private leastBookedData = {
        labels: ['Lakshadweep', 'Ziro', 'Spiti', 'Diu', 'Majuli'],
        values: [24, 31, 38, 45, 52]
    };

    private bookingStatusData = {
        labels: ['Confirmed', 'Pending', 'Cancelled'],
        values: [68, 22, 10],
        colors: ['#10b981', '#f59e0b', '#ef4444']
    };

    private popularityData = {
        labels: ['Goa', 'Manali', 'Kerala', 'Rajasthan', 'Ooty', 'Shimla'],
        values: [87, 73, 65, 54, 47, 42]
    };

    private monthlyTrendData = {
        labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
        values: [210, 258, 345, 289, 312, 387]
    };

    private travelModeData = {
        labels: ['Flight', 'Train', 'Bus'],
        values: [52, 31, 17],
        colors: ['#6366f1', '#10b981', '#f59e0b']
    };

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        const user = this.authService.currentUser;
        if (user) {
            this.userName = user.fullName.split(' ')[0];
        }
    }

    ngAfterViewInit() {
        setTimeout(() => this.drawAllCharts(), 100);
    }

    private drawAllCharts() {
        this.chartCanvases.forEach(canvasRef => {
            const canvas = canvasRef.nativeElement;
            const id = canvas.dataset['chartId'];
            switch (id) {
                case 'most-booked': this.drawHorizontalBar(canvas, this.mostBookedData, '#6366f1'); break;
                case 'least-booked': this.drawHorizontalBar(canvas, this.leastBookedData, '#f59e0b'); break;
                case 'booking-status': this.drawDoughnut(canvas, this.bookingStatusData); break;
                case 'popularity': this.drawVerticalBar(canvas, this.popularityData, '#8b5cf6'); break;
                case 'monthly-trend': this.drawLine(canvas, this.monthlyTrendData, '#3b82f6'); break;
                case 'travel-mode': this.drawDoughnut(canvas, this.travelModeData); break;
            }
        });
    }

    private setupCanvas(canvas: HTMLCanvasElement) {
        const dpr = Math.max(window.devicePixelRatio || 1, 2);
        const origW = parseFloat(canvas.getAttribute('width') || '300');
        const origH = parseFloat(canvas.getAttribute('height') || '150');
        const aspect = origH / origW;
        
        const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
        const logicalW = parentW > 50 ? parentW : origW;
        const logicalH = logicalW * aspect;
        
        canvas.width = logicalW * dpr;
        canvas.height = logicalH * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        return { ctx, w: logicalW, h: logicalH };
    }

    private drawHorizontalBar(canvas: HTMLCanvasElement, data: { labels: string[], values: number[] }, color: string) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const max = Math.max(...data.values);
        const barH = 18, gap = 10, paddingLeft = 68, paddingRight = 20, paddingTop = 12;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(0,0,0,0.02)';
        ctx.fillRect(0, 0, w, h);

        data.labels.forEach((label, i) => {
            const y = paddingTop + i * (barH + gap);
            const barW = ((data.values[i] / max) * (w - paddingLeft - paddingRight));

            // Label
            ctx.fillStyle = '#475569';
            ctx.font = '11px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(label, paddingLeft - 6, y + barH / 2 + 4);

            // Bar background
            ctx.fillStyle = 'rgba(0,0,0,0.05)';
            ctx.beginPath();
            ctx.roundRect(paddingLeft, y, w - paddingLeft - paddingRight, barH, 4);
            ctx.fill();

            // Bar fill with gradient
            const grad = ctx.createLinearGradient(paddingLeft, 0, paddingLeft + barW, 0);
            grad.addColorStop(0, color);
            grad.addColorStop(1, color + '99');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(paddingLeft, y, barW, barH, 4);
            ctx.fill();

            // Value
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 10px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(String(data.values[i]), paddingLeft + barW + 4, y + barH / 2 + 4);
        });
    }

    private drawVerticalBar(canvas: HTMLCanvasElement, data: { labels: string[], values: number[] }, color: string) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const max = Math.max(...data.values);
        const paddingBottom = 28, paddingTop = 14, paddingX = 12;
        const barW = Math.floor((w - paddingX * 2) / data.labels.length) - 6;
        ctx.clearRect(0, 0, w, h);

        data.labels.forEach((label, i) => {
            const barH = ((data.values[i] / max) * (h - paddingBottom - paddingTop));
            const x = paddingX + i * (barW + 6);
            const y = h - paddingBottom - barH;

            // Bar gradient
            const grad = ctx.createLinearGradient(0, y, 0, h - paddingBottom);
            grad.addColorStop(0, color);
            grad.addColorStop(1, color + '55');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Label
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x + barW / 2, h - 8);

            // Value
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.fillText(data.values[i] + '%', x + barW / 2, y - 3);
        });
    }

    private drawDoughnut(canvas: HTMLCanvasElement, data: { labels: string[], values: number[], colors: string[] }) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const cx = w / 2 - 10, cy = h / 2 + 2;
        const outerR = Math.min(cx, cy) * 0.72;
        const innerR = outerR * 0.58;
        const total = data.values.reduce((a, b) => a + b, 0);
        let startAngle = -Math.PI / 2;
        ctx.clearRect(0, 0, w, h);

        data.values.forEach((val, i) => {
            const slice = (val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
            ctx.closePath();
            ctx.fillStyle = data.colors[i];
            ctx.fill();
            startAngle += slice;
        });

        // Punch inner hole
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
        ctx.fillStyle = '#f1f5f9';
        ctx.fill();

        // Center label
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(total + '', cx, cy - 4);
        ctx.fillStyle = '#64748b';
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText('Total', cx, cy + 12);

        // Legend (right side)
        const legendX = w - 72, legendStartY = cy - data.labels.length * 14;
        data.labels.forEach((label, i) => {
            const ly = legendStartY + i * 26;
            ctx.fillStyle = data.colors[i];
            ctx.beginPath();
            ctx.roundRect(legendX, ly, 10, 10, 2);
            ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(label, legendX + 14, ly + 9);
            ctx.fillStyle = '#64748b';
            ctx.font = '9px Inter, sans-serif';
            ctx.fillText(data.values[i] + '%', legendX + 14, ly + 20);
        });
    }

    private drawLine(canvas: HTMLCanvasElement, data: { labels: string[], values: number[] }, color: string) {
        const setup = this.setupCanvas(canvas);
        if (!setup || !setup.ctx) return;
        const { ctx, w, h } = setup;
        const max = Math.max(...data.values);
        const paddingBottom = 28, paddingTop = 16, paddingX = 20;
        const n = data.labels.length;
        ctx.clearRect(0, 0, w, h);

        const pts = data.values.map((v, i) => ({
            x: paddingX + (i / (n - 1)) * (w - paddingX * 2),
            y: paddingTop + (1 - v / max) * (h - paddingTop - paddingBottom)
        }));

        // Area fill
        const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, h - paddingBottom);
        areaGrad.addColorStop(0, color + '55');
        areaGrad.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.moveTo(pts[0].x, h - paddingBottom);
        pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pts[pts.length - 1].x, h - paddingBottom);
        ctx.closePath();
        ctx.fillStyle = areaGrad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            const cpx = (pts[i - 1].x + pts[i].x) / 2;
            ctx.bezierCurveTo(cpx, pts[i - 1].y, cpx, pts[i].y, pts[i].x, pts[i].y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Dots + labels
        pts.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
            ctx.fillStyle = '#f1f5f9';
            ctx.fill();

            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.labels[i], p.x, h - 8);

            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.fillText(String(data.values[i]), p.x, p.y - 8);
        });
    }
}
